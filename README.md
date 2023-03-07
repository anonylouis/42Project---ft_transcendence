# 42Project---ft_transcendence

***ft_transcendence*** is the last project of the common core of the *42 School* !  
In this one, we have to realise a **single-page appplication** with some features !  

We used reactjs for the frontend part, nestjs for the backend part and a PostgreSQL database.  

**Made with the 42 students [rvalton](https://github.com/Oro31/Transcendance) and [melperri](https://github.com/Melvin42)**  

## Subject  

The website must have :  
- An interface to connect and register. User information must be stored in the database (passwords are hashed with *argon2*)  
- A user page with some details about your profile and the profile of other members.  
- A Chat with public/private rooms and administration tools (possibility to ban/mute/block/add as friend a user)  
- A fully functional ***Pong*** game : All users should be able to play and watch games with each other !  

## Commands

- To launch the project just clone and ```make```.  

- The containers will work in *detached mode*, use ```make check``` to see if they are running.  

- Use ```make stop``` to stop the dockers and  ```make clean``` to stop the dockers, delete them, delete their images, delete the 
docker volume and delete the docker network.  

## Photos

- **The user page** :  
<img src="https://github.com/anonylouis/42Project---ft_transcendence/blob/main/profile.png" width="70%">


- **The matchmaking page** :  
<img src="https://github.com/anonylouis/42Project---ft_transcendence/blob/main/matchmaking.png" width="70%">


- **The Pong Game** :  
<img src="https://github.com/anonylouis/42Project---ft_transcendence/blob/main/game.png" width="70%">
