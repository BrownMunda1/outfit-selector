# FitDecide

This project aims to solve the problem of selecting the perfect outfit for you.

The idea is simple - Upload your wardrobe and ask any questions regarding it!

Many a time you might have been in a dilemma of which outfit to select, for any particular occasion or situation. This project aims to solve that problem. It takes the context of all of your wardrobe outfit and accessories images and provides the top 3 outfit recommendations according to your query!

## Features
1. **User Authentication:** Users will be able to log in and keep their outfits private
2. **Interactive Chat:** Ask the selector in an interactive chat window, get top 3 outfit recommendations
3. **Upload Multiple Outfit Images:** Upload multiple outfits from your wardrobe at once
4. **Wardrobe Specific Suggestions:** All the suggestions from the interactive chat window will be specific to the outfit images which the logged in user has uploaded

## Technology Used
* Visual Studio Code
* React for frontend
* FastAPI for backend
* LangChain for AI, LangGraph for Chatbot
* GPT-4.1 for Image Processing
* MongoDB for database

## Shortcomings (As of now)

- The user can ask anything in the chat window. Need to make it specific to the outfits
- Authentication is Local Storage based. It is not safe enough

## Potential Future Features
- Add constraint to accept queries only related to outfits
- Add a rate limiter layer to prevent multiple LLM calls
- Integrate Weather API so that user can get recommendations according to the destination's weather
- Add a layer which can suggest outfits/accessories which the user can shop for, and possibly provide links to those
- Add a feature of chat persistence, user can continue to converse with a previous chat
