import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Sequence
from datetime import datetime
import asyncpg
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from mcp.server.models import InitializationOptions
from mcp.server import NotificationOptions, Server
from mcp.types import (
    Resource,
    Tool,
    TextContent,
    ImageContent,
    EmbeddedResource,
    LoggingLevel
)
import mcp.types as types
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for API
class QueryRequest(BaseModel):
    query: str
    params: Optional[Dict[str, Any]] = None

class QueryResponse(BaseModel):
    data: List[Dict[str, Any]]
    columns: List[str]
    row_count: int
    execution_time: float

class TableInfo(BaseModel):
    table_name: str
    column_count: int
    columns: List[Dict[str, str]]

# MCP Server Implementation
class PostgresMCPServer:
    def __init__(self, database_url: str, max_rows: int = 1000):
        self.database_url = database_url
        self.max_rows = max_rows
        self.pool: Optional[asyncpg.Pool] = None
        self.server = Server("postgres-mcp-server")
        
        # Setup MCP server handlers
        self._setup_handlers()
    
    def _setup_handlers(self):
        @self.server.list_resources()
        async def handle_list_resources() -> list[Resource]:
            """List available database resources"""
            resources = []
            
            if self.pool:
                try:
                    async with self.pool.acquire() as conn:
                        # Get all tables
                        tables = await conn.fetch("""
                            SELECT table_name, table_type 
                            FROM information_schema.tables 
                            WHERE table_schema = 'public'
                            ORDER BY table_name
                        """)
                        
                        for table in tables:
                            resources.append(Resource(
                                uri=f"postgres://table/{table['table_name']}",
                                name=f"Table: {table['table_name']}",
                                description=f"Database table '{table['table_name']}' ({table['table_type']})",
                                mimeType="application/json"
                            ))
                        
                        # Add database schema resource
                        resources.append(Resource(
                            uri="postgres://schema",
                            name="Database Schema",
                            description="Complete database schema information",
                            mimeType="application/json"
                        ))
                        
                except Exception as e:
                    logger.error(f"Error listing resources: {e}")
            
            return resources
        
        @self.server.read_resource()
        async def handle_read_resource(uri: str) -> str:
            """Read a specific database resource"""
            if not self.pool:
                raise RuntimeError("Database not connected")
            
            try:
                async with self.pool.acquire() as conn:
                    if uri == "postgres://schema":
                        # Return complete schema information
                        schema_info = await self._get_schema_info(conn)
                        return json.dumps(schema_info, indent=2)
                    
                    elif uri.startswith("postgres://table/"):
                        table_name = uri.split("/")[-1]
                        table_info = await self._get_table_info(conn, table_name)
                        
                        # Also get sample data
                        sample_data = await conn.fetch(f"SELECT * FROM {table_name} LIMIT 5")
                        table_info["sample_data"] = [dict(row) for row in sample_data]
                        
                        return json.dumps(table_info, indent=2, default=str)
                    
                    else:
                        raise ValueError(f"Unknown resource URI: {uri}")
                        
            except Exception as e:
                logger.error(f"Error reading resource {uri}: {e}")
                raise RuntimeError(f"Failed to read resource: {e}")
        
        @self.server.list_tools()
        async def handle_list_tools() -> list[Tool]:
            """List available database tools"""
            return [
                Tool(
                    name="execute_query",
                    description="Execute a SQL query on the PostgreSQL database",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "SQL query to execute"
                            },
                            "params": {
                                "type": "object",
                                "description": "Query parameters for parameterized queries"
                            }
                        },
                        "required": ["query"]
                    }
                ),
                Tool(
                    name="get_table_schema",
                    description="Get detailed schema information for a specific table",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "table_name": {
                                "type": "string",
                                "description": "Name of the table to get schema for"
                            }
                        },
                        "required": ["table_name"]
                    }
                ),
                Tool(
                    name="search_tables",
                    description="Search for tables and columns by name or description",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "search_term": {
                                "type": "string",
                                "description": "Term to search for in table and column names"
                            }
                        },
                        "required": ["search_term"]
                    }
                )
            ]
        
        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: dict) -> list[types.TextContent]:
            """Handle tool calls"""
            if not self.pool:
                return [types.TextContent(
                    type="text",
                    text="Error: Database not connected"
                )]
            
            try:
                if name == "execute_query":
                    result = await self._execute_query(
                        arguments.get("query"),
                        arguments.get("params")
                    )
                    return [types.TextContent(
                        type="text",
                        text=json.dumps(result, indent=2, default=str)
                    )]
                
                elif name == "get_table_schema":
                    async with self.pool.acquire() as conn:
                        schema = await self._get_table_info(conn, arguments["table_name"])
                        return [types.TextContent(
                            type="text",
                            text=json.dumps(schema, indent=2, default=str)
                        )]
                
                elif name == "search_tables":
                    result = await self._search_tables(arguments["search_term"])
                    return [types.TextContent(
                        type="text",
                        text=json.dumps(result, indent=2)
                    )]
                
                else:
                    return [types.TextContent(
                        type="text",
                        text=f"Unknown tool: {name}"
                    )]
                    
            except Exception as e:
                logger.error(f"Error in tool {name}: {e}")
                return [types.TextContent(
                    type="text",
                    text=f"Error executing {name}: {str(e)}"
                )]
    
    async def connect(self):
        """Connect to PostgreSQL database"""
        try:
            self.pool = await asyncpg.create_pool(
                self.database_url,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            logger.info("Connected to PostgreSQL database")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise
    
    async def disconnect(self):
        """Disconnect from PostgreSQL database"""
        if self.pool:
            await self.pool.close()
            logger.info("Disconnected from PostgreSQL database")
    
    async def _execute_query(self, query: str, params: Optional[Dict] = None) -> Dict:
        """Execute a SQL query safely"""
        if not query.strip().upper().startswith('SELECT'):
            raise ValueError("Only SELECT queries are allowed")
        
        start_time = datetime.now()
        
        async with self.pool.acquire() as conn:
            if params:
                rows = await conn.fetch(query, *params.values())
            else:
                rows = await conn.fetch(query)
            
            # Limit results
            if len(rows) > self.max_rows:
                rows = rows[:self.max_rows]
            
            execution_time = (datetime.now() - start_time).total_seconds()
            
            # Convert to list of dicts
            data = [dict(row) for row in rows]
            columns = list(rows[0].keys()) if rows else []
            
            return {
                "data": data,
                "columns": columns,
                "row_count": len(data),
                "execution_time": execution_time,
                "limited": len(rows) >= self.max_rows
            }
    
    async def _get_schema_info(self, conn) -> Dict:
        """Get complete database schema information"""
        schema_info = {
            "tables": {},
            "total_tables": 0,
            "generated_at": datetime.now().isoformat()
        }
        
        # Get all tables
        tables = await conn.fetch("""
            SELECT table_name, table_type
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        for table in tables:
            table_name = table['table_name']
            table_info = await self._get_table_info(conn, table_name)
            schema_info["tables"][table_name] = table_info
        
        schema_info["total_tables"] = len(tables)
        return schema_info
    
    async def _get_table_info(self, conn, table_name: str) -> Dict:
        """Get detailed information about a specific table"""
        # Get column information
        columns = await conn.fetch("""
            SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default,
                character_maximum_length,
                numeric_precision,
                numeric_scale
            FROM information_schema.columns 
            WHERE table_name = $1 AND table_schema = 'public'
            ORDER BY ordinal_position
        """, table_name)
        
        # Get primary keys
        primary_keys = await conn.fetch("""
            SELECT column_name
            FROM information_schema.key_column_usage
            WHERE table_name = $1 AND constraint_name LIKE '%_pkey'
        """, table_name)
        
        # Get foreign keys
        foreign_keys = await conn.fetch("""
            SELECT 
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1
        """, table_name)
        
        # Get row count
        try:
            row_count = await conn.fetchval(f"SELECT COUNT(*) FROM {table_name}")
        except:
            row_count = "Unknown"
        
        return {
            "table_name": table_name,
            "columns": [dict(col) for col in columns],
            "primary_keys": [pk['column_name'] for pk in primary_keys],
            "foreign_keys": [dict(fk) for fk in foreign_keys],
            "row_count": row_count,
            "column_count": len(columns)
        }
    
    async def _search_tables(self, search_term: str) -> Dict:
        """Search for tables and columns matching the search term"""
        async with self.pool.acquire() as conn:
            # Search table names
            tables = await conn.fetch("""
                SELECT table_name, table_type
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name ILIKE $1
                ORDER BY table_name
            """, f"%{search_term}%")
            
            # Search column names
            columns = await conn.fetch("""
                SELECT table_name, column_name, data_type
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND column_name ILIKE $1
                ORDER BY table_name, column_name
            """, f"%{search_term}%")
            
            return {
                "search_term": search_term,
                "matching_tables": [dict(table) for table in tables],
                "matching_columns": [dict(col) for col in columns],
                "total_matches": len(tables) + len(columns)
            }

# FastAPI Application
app = FastAPI(
    title="PostgreSQL MCP Server",
    description="MCP server for PostgreSQL database operations",
    version="1.0.0"
)

# Global MCP server instance
mcp_server: Optional[PostgresMCPServer] = None

@app.on_event("startup")
async def startup_event():
    """Initialize MCP server on startup"""
    global mcp_server
    
    # Replace with your actual database URL
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    mcp_server = PostgresMCPServer(DATABASE_URL)
    await mcp_server.connect()
    logger.info("MCP Server initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global mcp_server
    if mcp_server:
        await mcp_server.disconnect()

# FastAPI endpoints for direct access (optional)
@app.get("/")
async def root():
    return {"message": "PostgreSQL MCP Server is running"}

@app.post("/query", response_model=QueryResponse)
async def execute_query(request: QueryRequest):
    """Execute a SQL query directly via REST API"""
    if not mcp_server:
        raise HTTPException(status_code=500, detail="MCP server not initialized")
    
    try:
        result = await mcp_server._execute_query(request.query, request.params)
        return QueryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/tables")
async def list_tables():
    """List all database tables"""
    if not mcp_server or not mcp_server.pool:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    async with mcp_server.pool.acquire() as conn:
        tables = await conn.fetch("""
            SELECT table_name, table_type
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        return {"tables": [dict(table) for table in tables]}

@app.get("/tables/{table_name}")
async def get_table_info(table_name: str):
    """Get detailed information about a specific table"""
    if not mcp_server or not mcp_server.pool:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    try:
        async with mcp_server.pool.acquire() as conn:
            table_info = await mcp_server._get_table_info(conn, table_name)
            return table_info
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Table not found: {e}")

# MCP Server endpoints
@app.post("/mcp/initialize")
async def mcp_initialize():
    """MCP initialization endpoint"""
    return {
        "protocolVersion": "2024-11-05",
        "capabilities": {
            "resources": {},
            "tools": {},
            "logging": {}
        },
        "serverInfo": {
            "name": "postgres-mcp-server",
            "version": "1.0.0"
        }
    }

@app.get("/mcp/resources/list")
async def mcp_list_resources():
    """MCP list resources endpoint"""
    if not mcp_server:
        return {"resources": []}
    
    resources = await mcp_server.server._handle_list_resources()
    return {"resources": [r.model_dump() for r in resources]}

@app.get("/mcp/tools/list")
async def mcp_list_tools():
    """MCP list tools endpoint"""
    if not mcp_server:
        return {"tools": []}
    
    tools = await mcp_server.server._handle_list_tools()
    return {"tools": [t.model_dump() for t in tools]}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )