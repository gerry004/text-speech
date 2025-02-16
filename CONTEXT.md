## Overview
An application that transforms academic lecture notes into engaging podcast-style conversations between two hosts. The application accepts both PDF uploads and text input, converting academic content into natural dialogue format.

## Application Components

### User Input:
Header: "Turn your lecture notes into podcasts"
Chat-style interface similar to ChatGPT
Input options:
- Text input field for pasting content
- PDF file upload capability (multiple files supported)
Send button (arrow icon) on the right side of input

### Podcast Script Generation:
- Send Button (Arrow Icon) on the right side of input triggers script generation process
- Loading Indicator - Displays "Generating podcast script..." during processing
- Process the content of the uploaded files, extract the text, while preserving the original hierarchical structure of the notes.

Send parsed content to OpenAI API to generate a podcast script, with the following prompt:
```
Convert these lecture notes into a dynamic podcast conversation between two hosts:

Requirements:
- Host 1 is an expert in the subject
- Host 2 is a curious student
- Include real-world examples
- Ensure questions are thought-provoking
- Cover all key insights from notes

Required Conversation Structure:
1. Host 1 introduces the topic
2. Host 2 asks initial questions
3. Host 1 provides expert explanations
4. Host 2 asks follow-up questions
5. Host 1 elaborates with more detail
6. Repeat Q&A as needed for each key concept
7. Host 2 provides final summary

Output Format:
Host 1: [Introduction to topic]
Host 2: [Initial questions]
Host 1: [Expert explanations]
Host 2: [Follow-up questions]
Host 1: [Detailed responses]
Host 2: [Additional questions]
[Continue pattern for each key concept]
Host 2: [Comprehensive summary of discussion]
```
### Podcast Script Display, Editing and Audio Generation:
Show generated script in chat interface, formatted with clear speaker delineation, maintain proper spacing and formatting
There should be an "Edit Script" or "Generate Podcast Audio" button below the generated script

If Edit Script is clicked:
- allow the user to prompt an edit in the podcast script, and then send off the script again to the OpenAI API to generate the updated script, and display the updated script in the chat interface

If Generate Podcast Audio is clicked:
- display a loading indicator, Generating podcast audio...
- it should call the Google Text to Speech API, make sure Host 1 and Host 2 use different voices, and the voices should be male and female, and the voices should be natural and engaging, and the voices should be in the same language as the script
- once the audio is generated, it should be displayed in the chat interface
- there should be an option to download or play the audio



