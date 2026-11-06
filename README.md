# FitDecide 👕

**Your wardrobe. Your personal AI stylist.**

FitDecide is an AI-powered outfit recommendation application that helps you decide what to wear based on your personal wardrobe.

Ever found yourself staring at your wardrobe, unsure of what to wear for a particular occasion? FitDecide aims to solve exactly that.

Upload images of your clothes and accessories, interact with an AI-powered stylist, and receive personalized outfit recommendations based on the items you actually own.

Unlike generic styling assistants, FitDecide grounds its recommendations in your uploaded wardrobe, making suggestions relevant to your clothing collection.

## ✨ Features

- **User Authentication:** Secure user accounts to keep individual wardrobes private.
- **Interactive AI Stylist:** Chat with an AI-powered assistant to get outfit recommendations based on your requirements.
- **Bulk Wardrobe Upload:** Upload multiple clothing and accessory images to build your digital wardrobe.
- **Wardrobe-Aware Recommendations:** Get suggestions grounded in the clothing and accessories you have uploaded.
- **Personalized Outfit Suggestions:** Receive up to three outfit recommendations based on the context of your query.

## ⚙️ How It Works

1. **Build Your Wardrobe:** Upload images of your clothing and accessories.
2. **Image Processing:** Images are processed using GPT-4.1 to extract relevant clothing information.
3. **Contextual Retrieval:** Relevant wardrobe information is retrieved based on your query.
4. **AI-Powered Recommendations:** The AI assistant uses the retrieved wardrobe context to generate personalized outfit suggestions.
5. **Find Your Outfit:** Explore the recommended combinations and decide what works best for you.

## 🏗️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Backend | FastAPI |
| AI / LLM Integration | LangChain |
| Agent Orchestration | LangGraph |
| Image Understanding | GPT-4.1 |
| Database | MongoDB |

## 🖥️ Application Architecture

At a high level, FitDecide follows this workflow:

```text
                  User
                   |
                   v
              React Frontend
                   |
                   v
              FastAPI Backend
                   |
          +--------+---------+
          |                  |
          v                  v
     Image Upload       Chat Interface
          |                  |
          v                  v
     GPT-4.1           LangGraph
  Image Processing          |
          |                 v
          v           LangChain / LLM
     MongoDB                 |
          |                 v
          v           Context Retrieval
   Wardrobe Metadata         |
          |                 |
          +--------+--------+
                   |
                   v
          Outfit Recommendations
                   |
                   v
              User Interface
```

## 🚧 Current Limitations

FitDecide is an evolving project. The current implementation has a few known limitations:

- **Query Scope:** The chatbot does not yet strictly restrict conversations to outfit-related queries.
- **Authentication Security:** Authentication currently relies on local storage and requires a more secure implementation.
- **Conversation Persistence:** Conversations are not yet fully persistent across sessions.

## 🔮 Future Scope

The project is intended to evolve beyond a conventional outfit recommendation chatbot.

Potential enhancements include:

- Context-aware outfit recommendations using weather and location information.
- Persistent conversations and personalized styling preferences.
- Integration with calendar events for occasion-aware recommendations.
- Shopping recommendations for clothing and accessories missing from the user's wardrobe.
- Multi-step outfit planning for trips and special occasions.
- Agentic capabilities for autonomous planning, tool usage, and contextual decision-making.

For a more detailed breakdown of the planned architecture, engineering improvements, and future capabilities, see **[FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md)**.

## 🎯 Project Objective

FitDecide started as an exploration of combining computer vision, information retrieval, and conversational AI to solve a simple everyday problem.

The broader goal is to explore how these capabilities can evolve into a personalized, context-aware AI application that goes beyond answering questions and can help users accomplish tasks.

---

**Built with curiosity and a little help from AI.**
