We move to the next style of design pattern communication.

Very common, actually.

Very easy to implement and very popular.

Short pulling or just when people say polling, they usually refer to short polling.

And the idea of why we call short polling is because we it just it takes quick, right.

Takes a very quick time to poll.

Is this thing done or not?

So usually short polling is very common when you have a request that takes a long time to process and

you want to execute it asynchronously on the back end like we talked about in the asynchronous versus

synchronous lecture, where you can make the backend asynchronous process thing and return some sort

of a handle, a future, a job ID, task ID, and then the client can pull for the status of this job.

Is this job done?

It's just this job done or not?

Right.

So that's how our polling works.

And we're going to show some examples here.

So when request response, just vanilla request response isn't ideal is when the request actually takes

a long time to process.

You know, you are uploading a YouTube video, for example.

Right?

It takes a long time.

And so you don't want to sit there and wait for the whole video to be actually uploaded in order to

get a response.

Right.

I don't know if you notice like a few, if you ever uploaded a video to YouTube, the moment you upload

it, right, the progress actually continues.

You get an upload ID.

Yeah, you cannot close the browser meanwhile, but even if you do and you come back, the browser is

smart enough to it can pick up if it wants to.

I don't think YouTube does, but the idea here of having an upload ID so we can check the proxies,

you can slowly continue the process.

It's actually very elegant.

So the back end here in this case wants to send a notification, another another use case, right?

User Just log it in right.

Morning.

It's not a good idea for this, but you can do it definitely.

Right.

But if the back end has an event that happened, you want to know that this event of this event, either

a push or a pull can work at a cost response doesn't really work in that particular case.

Right.

Polling is a is a very good communication style for certain use cases.

And we're going to talk about some examples here.

So what is short polling?

The client send the request, the server immediately responds with a handle, right.

That's usually this handle is in form of a unique identifier that corresponds to this request.

The back end is free to do whatever it can do here.

It can queue, it can persist through some sort of a disk, it can put it in memory and then later execute

the request.

So the request is not executed immediately in this particular case, but you can check later for progress.

So the server continues to process the request maybe or pick it up later, and then the client uses

that handle to check for status and it will pull for the status.

Is this thing ready?

Is this thing ready?

Is a thing ready?

Right.

So that's how short polling works.

And the reason we call short is because we immediately going to get that result.

So technically it is a request response when you look at the polling from a very narrow angle.

Right.

So the idea of making the poll is a request response.

Right.

But the whole system is based on this asynchronous execution with short polling.

So multiple short requests as request response.

As Paul's right, we broke down into instead of one big request to response into if you want multiple

requests response which are presented to us as polls.

So as an example, you make a request.

Server immediately responds back, Hey, here is your request ID, here is your job ID, here is your

task ID his identifier.

The client can now save this ID to disk and then disconnect.

Another client can come in and pick it up and they say, Hey, we have a kind of pending request here.

Let me check.

So you get that question.

Is X ready?

Know the server immediately.

It's a quick check to check if it's ready.

Right.

Is it ready?

Nope.

Is it ready?

Nope.

Is ready.

Yes.

So at some point the request actually technically finished.

And here's where the response were finished.

But we didn't deliver it to the server, to the client.

We only delivered the response when the response when the request actually was completed.

So that next poll will actually have immediately the response in that particular case.

So that's how short polling works as opposed to making a request remove these orange and white lines

and you have one request and then we wait and then response.

So in that particular case, if we disconnect, the server will try to respond.

The client in this case was disconnected and we just lost a beautiful response.

The server is not going to keep the response around right in the original case, Right.

So what's the pros and cons?

Of course, nothing is perfect, right?

So what's the pros and cons?

Well, it's a very simple thing to implement short polling.

The client is a very simple to build.

And if you think about it, and the back end is also relatively simpler to build.

It's also good for long running requests.

If you have a request that takes a long time to actually execute, make it as a polling system, write

the whole thing, make it a poll instead of just a simple request response.

Change it so that not synchronously responding, but make the back, execute the thing asynchronously

and then make the back end response with a handle.

And lets have the client short poll for this handle right and the client can disconnect safely in this

case.

Right.

If you want, you can build that logic.

It's not hard, right?

Because in this case the client can just disconnect it.

It will persist the moment it receives the job ID or the task ID or the request ID, you can just save

it to disk.

Right?

And then the more the next moment you respawn respond, you read from disk and these are the pending

jobs and you can just loop and say, Hey, is this thing ready?

Is this thing ready?

This is a very attractive feature, right?

Of course, the backend should support this job saving thing.

And how long do you keep a job that has been finished in the back end?

Is.

Up to you the back end engineer, to configure, right?

Collins What's bad about this?

It's too chatty, right?

Very chatty.

What's the problem with chatting us?

Well.

The problem is not one client there say the problem is like, imagine you scaled this up, right?

You deployed your backend, you scaled it with h.r.

Proxy or in gen x.

Now we have multiple fleet of backends and you have this job execution thing that you built now, you

built the client and you shipped it.

Now you have people using your application.

Thousands and thousands of people.

Von clones make him poles.

That's not bad.

But imagine now thousands of people, each app is making 10 to 20 to 30 to 40 poles.

Right.

And how frequently are these Poles is up to you, right.

As a client configuration.

It adds up.

It really adds up.

If you make a lot of requests, the network is going to be congested, especially all these requests

are eventually going to be translated into TCP connections or UDP if you're using quick.

And all this will funnel to your backend infrastructure.

And these are just.

Most of them, maybe 99% of them are useless because say, hey, most of these are just cattiness that

says, hey, I'm going to respond with false because most of the jobs are not done right.

It's rare that the job is done versus the job is not done.

You can play with the configuration.

You can minimize the poll, but that's the problem to chatty.

As a result, it kills your network bandwidth.

Yeah.

And if we learned anything, the network bandwidth, especially on the back end, is really precious.

Because if you put everything into a cloud, that's how you get billed, right?

So you're back in architecture can make or make or break your back end application.

And it's a wasted back in resources, right?

Because all these network resources, even the when a when a backend receives a Chuck poll, it wants

to check for a poll, Right.

It receives a pull request, not pull request a poll.

Request p0ll not pull request, not GitHub or request.

So you get that and it has to do a check.

And that check takes finite amount of time.

This resources could have been spent serving actual requests and doing useful things.

So think about this in the big picture.

At the end of the day, let's do a quick demo.

I built an application to kind of a very simple application that kind of submits the job and then the

client can do short polling and we're going to do this through kernel.

The backend is Node.js because a lot of you guys are Node.js is a very popular JavaScript popular.

That's why I picked this language for this course.

You can do it in any, any language.

It doesn't really matter how we do it.

Let's jump into it.

All right.

So I'm going to use Express as my server here and I'm going to build a dictionary called the jobs here

that we're going to get submitted.

It's an empty dictionary, and the key will be the job ID here and the value will be the progress.

I'm actually going to make it fancier.

Another just is the job done or not?

But is the job actually what's the progress of this job?

And every time a user posts a submit, submits a job, just literally submits a job.

What is this doing?

Literally nothing in this case.

It's just it just waits for a timer.

And every 5 seconds I update the progress.

Well, with like 10%, you know, that's what I do.

It's a very simple thing.

Yeah.

When someone submits, I'm going to create a unique job ID and I use the time.

Bad idea.

Of course, if two people happen to have an executed in the same millisecond, you're going to get conflict

job ID It's a it's a simple demo here, so we don't have to worry about it.

Right.

So if I submit, I get a job ID based on the time, Right.

Job Colon is the job ID, right?

This is the job ID, I create a new dictionary.

The dictionary object becomes the key and then I set it to zero means, hey, it's not basically it

says it's just started.

A new job is just created.

So we have a new key and I'm going to call update job and the job will actually do the thing we just

talked about.

It will go it will add 10% every 5 seconds and update that job with a progress.

Yep.

And then finally, I'm going to respond to the user with the job ID.

So if someone submitted it, we're going to go the job ID.

The user can come later called check status with the job ID, and I'm going to get it from the query

parameter through the get request and just literally job job ID, print it in the console and then reply

say hey, let's to an end job status as much.

Very simple stuff.

Listen to the server of course on the TCP connection and this is the update job logic loop update.

Said the progress.

If it's a hundred quid, if it's not 100 after 3 seconds, go ahead and call update job plus 10%.

That's it.

How about we run it and test it out?

We're going to run it.

Got to go to Coral, and I'm going to submit a job call http.

Right.

Since it's a post request.

So I have to do post write localhost 8080 submit.

We'll get a get the job ID.

Beautiful.

Now I'm going to do a curl.

Local host, 1880.

Chick status.

Job ID based 40% already for 50%.

I'm polling right now.

See as we go.

I'm polling.

I'm sending a request.

So imagine this is a browser and it's there is a some sort of a timer that every 5 seconds go and pull

90%.

90%.

Hundred percent.

Right.

And that's basically polling so you can submit multiple jobs, actually.

So let's go ahead and submit another job because another job.

So you have to now we have two jobs running in parallel, right?

So I can think I can check this job, for instance.

And I can check the other job to.

And that's basically how polling works.

Very simple, very elegant.

But of course, the cost is the networking cost.

I'm going to share the code for you guys and time to jump into the next lecture.

We're going to talk about a better approach which is used by Kafka.

It's called Long Polling.

See you in the next lecture.