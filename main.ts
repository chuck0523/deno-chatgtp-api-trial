/**
 * Deno で ChatGPT API を実行するためのサンプル
 * 実行: $ API_KEY=ここにキー deno run --allow-net --allow-env main.ts "ここに指示"
 * 参考: https://zenn.dev/erukiti/articles/cli-gen-project-name
 */

export type Message = {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export const completeChat = async (
  apiKey: string,
  messages: Message[]
): Promise<Message | undefined> => {
  const body = JSON.stringify({
      messages,
      model: 'gpt-3.5-turbo',
  })

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
      },
      body,
  })

  const { choices } = await res.json()

  if (choices.length === 0) {
      return undefined
  }

  return choices[0].message
}


const messages: Message[] = [
  {
    role: "system",
    content:
      'あなたはプロフェッショナルなデータ分析者です。次に、JSONデータが提示されます。それは、人物ごとの属性が表形式になったものです。例えば、Johnは20歳のエンジニアで、年収は100000円です。',
  },
  {
    role: "system",
    content:
      `{
        header: ['name', 'age', 'profession', 'salary'],
        body: [
          ['John', 'Annie', 'Peter', 'Jane', 'Tom'],
          [20, 30, 40, 50, 60],
          ['Engineer', 'Teacher', 'Designer', 'Lawyer', 'Doctor'],
          [100000, 200000, 3000000, 400000, 500000]
      }`,
  },
  {
    role: "system",
    content:
      "次に、分析課題として入力が与えられます。課題に対する推量を行ってください。ここで重要なのは、推量はJSONデータを基に行うこと。一般論は一切不要です。",
  },
  {
    role: "user",
    content: Deno.args.join(" "),
  },
];

const apiKey = Deno.env.get('API_KEY')

if (apiKey === undefined) {
    console.log('API_KEY要設定')
    Deno.exit(1)
}

const res = await completeChat(apiKey, messages);

if (!res?.content) {
    console.log('生成失敗')
    Deno.exit(1)
}

console.log(res.content)
