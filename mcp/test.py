from gradio_client import Client, handle_file
import os
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "hf_your_actual_api_key_here"

client = Client("huggingface-projects/gemma-3-12b-it")
result = client.predict(
		message={"text":'''Can you list out my last 5 transactions from the given json data my userid is user_2uLeRedzQAkDxWNzzpSz3phKXNb carefully check my expensions whether credited or debited and give me total credit or debit based on it this is my json data: [
    {
      "id": "cm8bsy6ya000395ckttatu9lf",
      "from": "user_2uLeRedzQAkDxWNzzpSz3phKXNb",
      "to": "user_2uJBqA8JL7FNsbogvCDR24DyJLa",
      "status": "progress",
      "value": 12
    },
    {
      "id": "cm8bsy7fg000595cky0ofvrrm",
      "from": "user_2uLeRedzQAkDxWNzzpSz3phKXNb",
      "to": "user_2uJBqA8JL7FNsbogvCDR24DyJLa",
      "status": "progress",
      "value": 12
    },
    {
      "id": "cm8esem6u000195ho6u40cqzv",
      "from": "user_2uLeRedzQAkDxWNzzpSz3phKXNb",
      "to": "user_2uJBqA8JL7FNsbogvCDR24DyJLa",
      "status": "progress",
      "value": 23
    },

  ]
  '''},
		param_2="You are a helpful assistant.",
		param_3=700,
		api_name="/chat",
)
print(result)