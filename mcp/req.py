from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="novita",
    api_key="",
)

completion = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-Prover-V2-671B",
    messages=[
        {
            "role": "user",
            "content": "What is the capital of France?"
        }
    ],
)

print(completion.choices[0].message)