import { createAnswer } from "../config/abacus-ai";
// import { gemini } from "../config/gemini";
import { User } from "../types";
import CustomError from "../utils/Custom-error";

export const createChatbotAnswer = async ({
  data,
  user,
}: {
  data: { prompt: string };
  user?: User;
}) => {
  if (!user) throw new CustomError("user is not exist,", 400);

  // const contents = `The following is a conversation with an AI assistant built for a personal finance tracker.
  //         The assistant can help the user with financial guidance, advice, money management tips, budgeting rules, and general finance-related questions. It is helpful, creative, clever, and very friendly. The assistant also keeps small talk light and engaging, making the user feel comfortable while discussing finance topics.
  //         The assistant should provide advice, tips, or general knowledge about finance, budgeting, saving, and spending.
  //         The assistant should respond in a friendly, approachable, and conversational tone.
  //         If a user question requires database access or real-time personal finance data, the assistant will not handle it; only general advice and guidance are in scope for this prompt.
  //         The assistant can explain complex finance concepts in simple terms, provide best practices, and offer actionable tips where appropriate.
  //         Context / previous conversation with the user:
  //         User input: ${data.prompt}
  //         Suggested AI Response:`;
  // const response = await gemini({ contents });

  // return {
  //   id: Math.random(),
  //   prompt: data.prompt,
  //   answer: response.text,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  //   userId: 123,
  //   type: "user",
  // };

  const response = await createAnswer({
    message: data.prompt,
    sender: user.sub,
  });

  console.log("response: ", response);

  return {
    id: Math.random(),
    prompt: data.prompt,
    answer: response,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 123,
    type: "user",
  };
};

export const getChats = () => {
  return [];
};

// # The config recipe.
// recipe: default.v1

// # The assistant project unique identifier
// # This default value must be replaced with a unique assistant name within your deployment
// assistant_id: 20250831-023742-shiny-volume

// language: en
// pipeline:
// # Traditional NLU pipeline that works well with your custom actions
// - name: WhitespaceTokenizer
// # - name: LexicalSyntacticFeaturizer
// - name: CountVectorsFeaturizer
// - name: NLUCommandAdapter
//   # min_df: 1  # Accept features that appear at least once
//   # max_features: 1000
// # - name: CountVectorsFeaturizer
// #   analyzer: char_wb
// #   min_ngram: 1
// #   max_ngram: 4
// - name: DIETClassifier
//   epochs: 100
//   constrain_similarities: true
// - name: EntitySynonymMapper
// - name: ResponseSelector
//   epochs: 100
//   constrain_similarities: true

// # Configuration for Rasa Core.
// policies:
// - name: FlowPolicy
// - name: MemoizationPolicy
// - name: RulePolicy
// # Add fallback policy to handle unrecognized inputs
// # - name: FallbackPolicy
// #   nlu_threshold: 0.3  # If NLU confidence is below 0.3, trigger fallback
// #   core_threshold: 0.3  # If dialogue management confidence is below 0.3, trigger fallback
// #   fallback_action_name: action_default_fallback
