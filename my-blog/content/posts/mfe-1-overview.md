+++
date = '2026-03-08T18:08:18Z'
draft = false
title = 'Micro-frontend - Modernization using iframe based runtime integration'
tags = ['architecture', 'micro-frontend', 'cloudflare', 'iframe']
+++

## Background

I had to maintain and enhance a product that was a static web app based on Preact and Yarn with a lot of custom code and abstractions which made the code difficult to understand and maintain, further compounded by the lack of documentation and institutional knowledge. The task given to me was to come up with a strategy for modernizing the product so that new features can be delivered faster using a more recent technology stack. 

The current code was in a monorepo with a lot of coupling between different modules along with custom patches and a fully custom build process. So on the whole, it wasn't amenable to introducing a new technology or updating it in just one place as the impact could be in multiple places. Also, the team's newness and small strength along with the focus on delivering new features meant a full rewrite was out of the question.

## Strategy

The approach I proposed was to incrementally modernize the application one feature at a time. In short, the application was amenable to a vertical slicing of a set of features where each vertical slice would become a separate micro-frontend (MFE) application and the existing application would act as a shell for the micro-frontends to be eventually replaced when all the features within it had been migrated. 

The idea being that as we develop a new feature, we create a new micro-frontend application (or use it if it was created previously) and implement just the required feature(s) within it. This meant that we did not have to migrate all the features within the slice immediately.

### Why was an IFrame approach suitable

1. Iframes allow us to surgically insert just the new feature at a particular place/panel in an existing page of the application on some action like when a view is loaded or when a menu item is clicked. 
2. It offers complete isolation for style and scripts which means that the MFE can use a completely different tech stack which in this case was a React 19 based application served from a Cloudflare worker (similar to the existing shell app).
3. There are multiple methods for same-origin and cross-origin communication.
4. It is a feature that is well understood and supported across browsers.

## Architecture

### Diagram
```

                                                        Cloudflare Shell Worker
                                                             ┌───────────┐          
                                                             │           │          
         Browser                                             │           │          
┌─────────────────────────────────────────────┐              │           │          
│    https://mfdemo.skudva.com                │              │           │          
│---------------------------------------------│              │           │
│                                             │              |           │          
│                                             │─────────────►│           │
│        Iframe                               │              │           │          
│   ┌─────────────────────────────────┐       │              │           │          
│   │ https://mfdemo.skudva.com/mfe1  |       │              │           │          
│   │                                 │       │              │           │          
│   │                                 │       │              └───────────┘          
│   │                                 │       │                                     
│   │                                 │       │                                     
│   │                                 │       │                                     
│   └─────────────────────────────────┘       │                                     
│                │                            │                                     
└────────────────┼────────────────────────────┘          Cloudflare MFE Worker 
                 │                                            ┌───────────┐         
                 │                                            │           │         
                 │                                            │           │         
                 │                                            │           │         
                 │                                            │           │         
                 │                                            │           │         
                 └───────────────────────────────────────────►│           │         
                                                              │           │         
                                                              │           │         
                                                              │           │         
                                                              │           │         
                                                              │           │         
                                                              │           │         
                                                              └───────────┘         

```

### Explanation
The shell application and MFE are both served by different Cloudflare workers and use Static Assets to serve the static files. 

The MFE is linked into the shell application using an iframe. The iframe URL is the relative URL of the MFE which can be further specific to the exact feature in the MFE. 

Although I used Cloudflare, the same can be easily achieved using NGINX (I will create a post for this in future).

## MFE Communication
Data needed by MFE can be passed as query parameters which the MFE can use to query any service and display the output to the user. This means that the MFE's iframe reloads each time the data passed to it changes, which is not ideal for UX but is acceptable as an interim measure. A future post will highlight how to remediate this. Note that the shell and MFE have their own state management approaches and tools and these are not shared. Only the data that is specific to the user action is sent from shell to MFE. For example, if the user is on a particular node in the shell, the node ID is passed to the MFE as a query param so it can display a report for that node.

### Caching Strategy
Until we move away from iframe reloads, a smart way to reduce reload time is to cache all static assets using cache control headers so that a reload does not have to fetch all the static assets again. This will prove useful even after moving away from iframe reloads.

## Same Origin Policy
To ensure that the MFE can access the login tokens and not face cross-domain restrictions, it was important to ensure that the client browser sees both shell and MFEs as coming from the same domain. This was achieved initially by using the shell app as the gateway controller so that it serves the MFE static files (obtained using fetch from shell worker from MFE worker) as well as its own files. However, Cloudflare's custom domain feature removes the need for a gateway pattern which can prove fragile when more MFEs are introduced, allowing for a cleaner, less coupled approach.

### Using Authentication tokens
The shell app stores the auth tokens in session storage and the MFE retrieves it from the session storage as needed. This works because of the same origin architecture. We do not expect the MFE to be independently accessed in this case so this approach is fine.

### CORS (Cross Origin Resource Sharing)
Both the shell app and MFE communicate to the backend API which is on a different domain directly from the client browser. The API requests are considered as coming from the same domain which is already whitelisted by the API so there is no MFE specific configuration needed in the backend API.


## Demo

Check out the simple demo below! Although I have used simple HTML files, the concept remains the same so long as the shell app and MFE are static web apps.

You can find the working demo at <https://mfdemo.skudva.com/>

The GitHub repo for the demo can be found at <https://github.com/shrinik/cloudflare-microfrontend-demo>

### Cloudflare configuration
The Git repo contains two cloudflare workers. Each worker has its static assets in dist folder. The wrangler.toml file in each worker directory has the path of the worker and the mapping to the assets directory. The shell app worker defines the base URL or the URL used in the client browser as a custom domain. The MFE worker defines a more specific URL path.

### Iframe configuration
The index.html file in shell app defines an iframe with the src attribute matching the MFE path URL. Thus, when the shell app loads, the iframe URL is resolved as the base path of the shell app and the MFE path. Since the path is more specific than the base path alone, Cloudflare will direct this request to the MFE worker instead of the shell worker which will result in the MFE assets being loaded.

## Key Takeaways

This iframe-based approach offers several advantages for modernizing legacy applications:

- **Incremental progress** - Modernize features at your own pace without requiring a complete rewrite
- **Technology flexibility** - Each MFE can use different tech stacks independently
- **Style and script isolation** - No conflicts between legacy and modern code
- **Reduced risk** - Problems in one MFE don't cascade through the entire application
- **Team independence** - Teams can work on different MFEs without blocking each other

The main trade-off at this stage is the UX impact of iframe reloads when data changes. Future posts in this series will explore solutions to this limitation and other advanced patterns for optimizing micro-frontend communication.

## What's Next

Stay tuned for upcoming posts that will dive deeper into:
- Handling Modals
- Optimizing performance with caching strategies
- Advanced inter-MFE communication patterns
