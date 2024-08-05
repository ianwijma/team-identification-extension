# team-identification-extension
Helps teams identify which team owns which frontend elements and backend requests.


## The idea

Adding an identifier to frontend elements and backend requests allows any team with the extension to identify which team owns the component or request.

There is support for remote configuration for scrambling the element property, request header and team names to make it impossible for outsiders to see this information.


## Frontend

In the front end, we use the default element property `team-identification-extension` tag, which can be configured in the local settings or remote config.


## Backend

In the backend, we use the default request header `x-team-identification-extension`, which can be configured in the local settings or remote config.

## Teams

By default, the extension will show the value of the element property or request header. But this means exposing internal names externally. 
So you can use the extensions setting or remote config to scramble this in the front end, which uses these local settings or remote config to unscramble these names.

Besides the name, there is support for a markdown description, where you can put in whatever you need. During our use-case, we added a link to a communication channel for devs or CSS to reach out to in case help is needed.

## Element property/request header scrambling

By default, the element property `team-identification-extension` and request header `x-team-identification-extension` is used to identify which team belongs to which element & request. 

## Local settings 

Local settings are quite similar to the remote config where the team name unscrambling & description can be set and the element property/request header **un**scrambling information.

Besides this there are some other settings like 

## Remote config

The idea behind the remote config is to allow the managing of the unscrambling of the team names, element property request header and team description to be on a service or static JSON file. 

This allows updates to happen without manually updating the settings, which at a larger scale becomes a hassle/impossible.

## Dev Updated

- [2024/07/28] - https://www.youtube.com/watch?v=C9mETaIYih0

## Local Devloop

Build the extension:

```bash
    npm run dev
```

Add the extenion to your chrome browser of choice.

Made a change? Build the extension again, reload extension, test out change.
