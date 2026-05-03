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
* LangChain for AI, LangGraph is planned
* GPT-4.1 for Image Processing
* MongoDB for database

## Shortcomings (As of now)

1. The user can ask anything in the chat window. Need to make it specific to the outfits
2. The interactive chat window does not accept more than one chat, it is a single back and forth chat state
3. The response from AI isn't formatted when it is displayed on the screen
4. Authentication is Local Storage based. It is not safe enough

## Potential Future Features
1. Multiple back and forth chat support
2. Add constraint to accept queries only related to outfits
3. Format the results of LLM so that users get a better UX
4. Integrate Weather API so that user can get recommendations according to the destination's weather
5. Add a layer which can suggest outfits/accessories which the user can shop for, and possibly provide links to those
6. Add a rate limiter layer to prevent multiple LLM calls
