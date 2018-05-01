# D-S-Collaborative-Whiteboard-Website
Collaborative Whiteboard Website Project. Users can draw, insert text, insert shapes 
and more, such as set reminders, which will email the user on the date and other users 
can be invited to the whiteboard to edit in real time and communicate using the text chat.
The whiteboard can be shared to social media. The website has all the features for registering 
and signing in.

# USE:
PC with Node.js and MySQL installed.
Import the <b> bdata </b> folder into MySQL workbench and update the database login 
in <b> server.js line 52-54 </b> to match your database login. Afterwards download and install
all packages in package.json using npm or if using WebStorm IDE just click run.
Run <b> server.js </b> in Node.js and access http://localhost:3000/ in a browser.
If you wish to use reminder email function, input a email address and password in 
<b> server.js line 73-74 </b>.

# PROGRAM: 
First create a account and login using the account. There is no validation checking in
either registeration or login. In the user page, you can create a whiteboard, access your 
whiteboards, under shared whiteboards you can access whiteboard you were invited to by 
someone else, see notifications if you were added as friend or invited to a whiteboard and 
search and add friends by their username. Only friends can be invited to collaborate on the 
whiteboard. Once accessing the whiteboard page, the user can draw on whiteboard, change the 
title, share the whiteboard, invite other users by hovering over collaborate menu at the 
bottom right and add collaborators from your friend list. Only the creator of the whiteboard 
can invite other collaborators, change the title and get the whiteboard URL for sharing.
The "Start Talk" is a expermitenal feature I was testing out in the end; it allows to share
the mouse movements of each user and chat with other users (only works on Google Chrome). 
To use the Start talk feature, the user needs to share the URL provided.

# LIBRARIES:
-Socket.io: Real-time collaboration library  
-Fabric.js: The HTML5 canvas library.
-jsPDF: PDF generator.  
-Together.js: collaboration tool.
