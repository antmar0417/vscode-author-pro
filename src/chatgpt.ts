import axios, { AxiosResponse } from "axios";

import * as ApiKey from "./api-key";

// console.log("API Key is: ", ApiKey.CHATGPT_API_KEY);

export type ChatGptMessage = {
  role: string; // user or assistant
  content: string;
};

export type ChatGptChoice = {
  index: number;
  message: ChatGptMessage;
  finish_reason: string;
};

export type ChatGptUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export type ChatGptResponse = {
  id: string;
  object: string;
  created: number; // timestamp
  choices: Array<ChatGptChoice>;
  usage: ChatGptUsage;
};

export type ChatGptCompletionPostData = {
  model: string;
  max_tokens?: number;
  messages: Array<ChatGptMessage>;
};

const OPENAPI_API_URL = "https://api.openai.com/v1/chat/completions";
// const OPENAPI_API_URL =
//   "https://api.openai.com/v1/engines/davinci-codex/completions";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${ApiKey.CHATGPT_API_KEY}`,
};

const MAX_TOKENS = 350;

let __inst: GptGetter | null = null;

export class GptGetter {
  // Add a response property to the class
  response: AxiosResponse | null = null;

  // List of previous messages
  previousMessagesArray: Array<ChatGptMessage> = [];

  constructor(prompt: string | undefined) {
    this.resetHistory(prompt);
  }

  static getInst(prompt: string | undefined): GptGetter {
    console.log("getInst called with prompt:", prompt);
    if (__inst === null) {
      __inst = new GptGetter(prompt);
      console.log("New GptGetter instance created");
      return __inst;
    } else {
      console.log("Existing GptGetter instance returned");
      return __inst;
    }
  }

  resetHistory(prompt: string | undefined) {
    this.previousMessagesArray = prompt
      ? [
          {
            role: "user",
            content: prompt,
          },
          { role: "assistant", content: "OK" },
        ]
      : [];
  }

  getGptCompletion = async (prompt: string): Promise<string> => {
    const newMessage: ChatGptMessage = {
      role: "user",
      content: prompt,
    };

    this.previousMessagesArray.push(newMessage);
    console.log(
      "previousMessagesArray1::",
      JSON.stringify(this.previousMessagesArray)
    );

    const data: ChatGptCompletionPostData = {
      model: "gpt-3.5-turbo",
      max_tokens: MAX_TOKENS,
      messages: [...this.previousMessagesArray],
    };

    try {
      // console.log("Asking assistant:", JSON.stringify(data, null, 2));
      // console.log("Headers:", HEADERS); // Log the headers here

      // Assign the response to the class property
      this.response = await axios.post(OPENAPI_API_URL, data, {
        headers: HEADERS,
      });

      // Log the request details
      // if (this.response !== null) {
      //   console.log(
      //     "AxiosResponse:\n",
      //     JSON.stringify(
      //       {
      //         status: this.response.status,
      //         headers: this.response.headers,
      //         data: this.response.data,
      //       },
      //       null,
      //       2
      //     )
      //   );
      // } else {
      //   console.log("Response is null");
      // }

      let gptRsp: ChatGptResponse | null = null;

      // console.log("AxiosResponse:\n", JSON.stringify(response, null, 2));

      if (this.response !== null) {
        gptRsp = this.response.data;
      }

      if (gptRsp !== null && gptRsp.choices.length > 0) {
        const newResponse: ChatGptMessage = {
          role: "assistant",
          content: gptRsp.choices[0].message.content,
        };

        this.previousMessagesArray.push(newResponse);
        console.log(
          "previousMessagesArray2::",
          JSON.stringify(this.previousMessagesArray)
        );

        console.log("First choice content:", gptRsp.choices[0].message.content);

        return gptRsp.choices[0].message.content;
      } else {
        console.log("gptRsp is null or gptRsp.choices is empty");
      }

      return "ok";
    } catch (error: any) {
      console.error("Error calling GPT API:", error.message);
      throw error;
    }
  };
}

export async function getGptCompletion(prompt: string): Promise<string> {
  //const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";

  return GptGetter.getInst(undefined).getGptCompletion(prompt);
}

// // Create an instance of GptGetter
// const gptGetter = GptGetter.getInst("Hello!");

// // Call the getGptCompletion method
// gptGetter
//   .getGptCompletion("Hello! How match is 8 + 9?")
//   .then((response) => {
//     console.log("GPT response:", response);
//   })
//   .catch((error) => {
//     console.error("Error:", error.message);
//   });
