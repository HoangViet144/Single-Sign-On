# Single Sign On
This project is conducted for Network Security assignment in semester 202 by students of Ho Chi Minh City University of Technology, Vietnam National University Ho Chi Minh City.

Member:
* [Viet H. Tran](https://github.com/HoangViet144)
* [Khang G. Hoang](https://github.com/khangsk)
* [Nhan T. Nguyen](https://github.com/nhannguyen02122000)

## Identity Provider
This is the heart of single sign on system. It provides methods for authentication and authorization. 

A demo has been deployed on Heroku: [Identiy provider](https://sso-service.herokuapp.com/)

## Service Provider
A sample service provider is introduced for testing purpose.

A demo has been deployed on Heroku: [Service provider](https://serviceprovider.herokuapp.com/)

## Deployment
In order to deploy, you should deploy each provider subfolder and follow the instruction on [Heroku](https://devcenter.heroku.com/articles/git) site.

Regarding identity provider, you must create postgresql instance on heroku and run [init.sql](https://github.com/HoangViet144/Single-Sign-On/blob/master/IdentityProvider/init.sql) first.
