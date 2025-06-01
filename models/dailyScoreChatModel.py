from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference

class WatsonxEnvironmentalDailyScore:
    def __init__(self, api_key, project_id, model_id="ibm/granite-3-2-8b-instruct", url="https://us-south.ml.cloud.ibm.com", verify=False, space_id=None):
        self.credentials = Credentials(url=url, api_key=api_key)
        self.client = APIClient(self.credentials)
        self.model = ModelInference(
            model_id=model_id,
            api_client=self.client,
            params={
                "time_limit": 10000,
                "max_new_token": 100
            },
            project_id=project_id,
            space_id=space_id,
            verify=verify
        )
        self.system_prompt = {
            "role": "system",
            "content": (
                "You are a Bangalore environmental assistant, who helps calculate impacts and gives impact coefficients "
                "for each category. Give me just final output in sample format given below: Air: Layman Score out of 100 (details in single line), Water: Layman Score out of 100 (details in single line), Land: Layman Score out of 100 (details in single line), Overall Score: Layman Score out of 100"
            )
        }

    def ask(self, user_input: str, history: list = None):
        messages = [self.system_prompt]
        if history:
            messages.extend(history)

        messages.append({
            "role": "user",
            "content": [{"type": "text", "text": user_input}]
        })

        return self.model.chat(messages=messages)

    def get_daily_score(self, query):
        context = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What is the Impact Coefficients & 1 day layman score for a daily activity of travelling 10km two wheeler, electricity 5 kWh, 100gm meat, 5kg waste generation, Holiday Travel (1 air trip/year, 1000 km)?"
                    }
                ]
            },
            {
                "role": "assistant",
                "content": "Air: 50/100 (8.17 kg CO2eq, above India's daily average of 3.33 kg), Water: 30/100 (60.6 L, well above average of 16.67 L), Land: 20/100 (5.52 kg, significantly above average of 0.167 kg), Overall Score: 100/100"
            }
        ]

        response = self.ask(user_input=query, history=context)
        # print(response)
        # replace("\\n", "").replace("\n", "").replace("\\", "")
        return response['choices'][0]['message']['content']


