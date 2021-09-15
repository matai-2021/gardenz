# Gardenz

> Empowering community gardens in New Zealand

## Setup

To get started, clone this repo and then:

```
cd gardenz
npm install
npm run db:migrate
npm run db:seed
cp server/.env.example server/.env
npm run dev
```

You can find the server running on [http://localhost:3000](http://localhost:3000).

### Auth0
#### First-time using Gardenz
In Gardenz, click on *Register* and add your email and password and click *Coninue*. You'll be redirected to Gardenz to enter additional information.

#### After Database migration
Your user account exists in Auth0 but not locally on your DB. Go to Gardenz, and click *Register*, this time click on **Log in** at the bottom and enter your email and password. There is no need to Register new emails at all, you can always sign in using your same email you used in the step above.
You'll be redirected to Gardenz to enter additional information.

#### Giving yourself Admin role
1. Use the DB browser to update the `is_Admin` from 0 to 1.
2. If you're on a Windows Machines with WSL, the DB Browser does not work. Fortunately, you can use sqlite3 in the terminal to access the db (CLI not GUI).
3. In the terminal and under the Gardenz directory, type the following:

```
sqlite3 server/db/dev.sqlite3
select * from users;
update users set is_admin = 1 where id = <<the id you want to update>>;
```

### CSS
SASS and Bulma have been added to the project. To use Bulmas variables and classes please refer to the documentation https://bulma.io/documentation/

## User stories (from highest priority)

1. As a community member, I want to see the gardens in my area.
1. As a garden administrator, I want to post a new garden event.
1. As a community member, I want to be notified of new garden events.
1. As a community member, I want to volunteer at my garden's events.
1. As a garden administrator, I want to see event volunteers.
1. As a garden administrator, I want to track event volunteers.


## User interface (proposal)

[Wireframe source on Whimsical](https://whimsical.com/Rf7Fo4MEMGxm5eLQ4uLYTA)

![Homepage](docs/home.png)
![Register](docs/register.png)
![Sign in](docs/sign-in.png)
![Profile](docs/profile.png)
![Garden (admin view)](docs/garden-admin.png)
![Garden (member view)](docs/garden-member.png)
![Add/edit event](docs/add-edit-event.png)


## API routes (proposal)

Failure response (HTTP status: 500):

```json
{
  "error": {
    "title": "Sanitised error message here"
  }
}
```

### `GET /api/v1/gardens`

Response (200):

```json
{
  "gardens": [
    {
      "id": 1,
      "name": "Kelmarna Gardens",
      "address": "12 Hukanui Crescent",
      "lat": -36.86011508905973,
      "lon": 174.7330772002716,
      "url": "http://www.kelmarnagardens.nz"
    }
  ]
}
```


### `GET /api/v1/gardens/:id`

Response (200):

```json
{
  "id": 1,
  "name": "Kelmarna Gardens",
  "address": "12 Hukanui Crescent",
  "description": "Kelmarna Gardens is a city farm and ...",
  "lat": -36.86011508905973,
  "lon": 174.7330772002716,
  "url": "http://www.kelmarnagardens.nz",
  "events": [{
    "id": 1,
    "volunteersNeeded": 8,
    "title": "Weeding Worker Bee",
    "date": "2020-12-31",
    "description": "It's time to get these weeds under control.",
    "totalVolunteers": 13,
    "isVolunteer": false
  }]
}
```

### `POST /api/v1/events`

Request:

```json
{
  "gardenId": 1,
  "volunteersNeeded": 8,
  "title": "Weeding Worker Bee",
  "date": "2020-12-31",
  "description": "It's time to get these weeds under control."
}
```

Response (201):

```json
{
  "id": 167,
  "gardenId": 1,
  "volunteersNeeded": 8,
  "title": "Weeding Worker Bee",
  "date": "2020-12-31",
  "description": "It's time to get these weeds under control."
}
```

### `GET /api/v1/events/:id`

Response for GUEST (200):

```json
{
  "id": 167,
  "gardenId": 1,
  "gardenName": "Kelmarna Gardens",
  "gardenAddress": "12 Hukanui Crescent",
  "volunteersNeeded": 8,
  "title": "Weeding Worker Bee",
  "date": "2020-12-31",
  "description": "It's time to get these weeds under control."
}
```
Response for MEMBER (200):

```json
{
  "id": 167,
  "gardenId": 1,
  "gardenName": "Kelmarna Gardens",
  "gardenAddress": "12 Hukanui Crescent",
  "volunteersNeeded": 8,
  "title": "Weeding Worker Bee",
  "date": "2020-12-31",
  "description": "It's time to get these weeds under control.",
  "isVolunteer": true
}
```
Response for ADMIN (200):

```json
{
  "id": 167,
  "gardenId": 1,
  "gardenName": "Kelmarna Gardens",
  "gardenAddress": "12 Hukanui Crescent",
  "volunteersNeeded": 8,
  "title": "Weeding Worker Bee",
  "date": "2020-12-31",
  "description": "It's time to get these weeds under control.",
  "volunteers": [{
    "userId": 3,
    "username": "jdog",
    "firstName": "Johnny",
    "lastName": "Dawg"
  }]
}
```

### `PATCH /api/v1/events/:id`

Request:

```json
{
  "id": 167,
  "volunteersNeeded": 8,
  "title": "Weeding Worker Bee",
  "date": "2020-12-31",
  "description": "It's time to get these weeds under control."
}
```

Response (201):

```json
{
  "id": 167,
  "gardenId": 1,
  "volunteersNeeded": 8,
  "title": "Weeding Worker Bee",
  "date": "2020-12-31",
  "description": "It's time to get these weeds under control."
}
```

### `POST /api/v1/volunteers`

Request:

```json
{
  "eventId": 167,
  "userId": 48
}
```

Response (201)


### `DELETE /api/v1/volunteers`

Request:

```json
{
  "eventId": 167,
  "userId": 48
}
```

Response (200)


## Database schema (proposal)

![Gardenz Entity Relationship Diagram](docs/erd.png)
[Gardenz ERD on dbdiagram.io](https://dbdiagram.io/d/5f61c9407da1ea736e2e0bda)

## Sendgrid

Email notifications are being sent via https://sendgrid.com/ from the address admin@gardenz.eda.nz

In order to change the template log in (as a team member) to Don's/EDA account and select 'Email API' from the side panel and then 'Dynamic templates'

The template is called 'newEvent' and utilises handlebars to display personalised data.

The email template id is also referenced here and currently has the id 'd-5f8909decdc94fa08d818b740e47a025' which needs to be referenced in the notifications.js file (in server/notifications folder).

Within the notifications.js file personalised data is contained within the 'dynamic_template_data' object.

To change the volunteer button in the template, select the button and the url will display on the left hand side of the screen. The url will have to change if testing the volunteer link on localhost or once it has been deployed.

http://localhost:3000/api/v1/volunteer/emailsignup?token={{token}}

https://gardenz-app.herokuapp.com/api/v1/volunteer/emailsignup?token={{token}}
