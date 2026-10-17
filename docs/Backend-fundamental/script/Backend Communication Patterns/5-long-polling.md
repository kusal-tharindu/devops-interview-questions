All right.

Long pulling.

It's when I first heard about the long polling pattern, it was maybe 40 years ago when I first was,

you know, got interested in Kafka and I was reading about Kafka and was heard like, Hey, we didn't

use the push model and we moved to a long polling one.

I was like, What is polling?

Then I found out it's a very neat trick that you can do in the back end to avoid the shadiness of short

polling or just polling, right?

So the request takes a long time.

I'll check with you later, but.

Talk to me only when it's ready.

That is a trick.

So you will make the trick as you will make a poll request.

Same thing.

A request to pole.

But the server just doesn't respond.

Doesn't write anything to the socket.

Right.

Instead of saying immediately, Hey, it's not ready falls, it just waits there.

So the client is asynchronously doing its own thing because it sends the request asynchronous.

All clients do now these days, right?

But the server also, since it knows that the job is not ready, the response is not ready, it will

just say, okay.

I'll just do my own thing and I'll come back later.

Right.

So it got the first request, got the job ID, and then the next request to do long polling will say

it will block effectively, if you will, if you can use that word, the server will not just respond.

Let's take an example here.

So one request responds.

Our ideal request takes a long time or.

Same thing, right?

Same thing.

With that polling.

You are uploading a video, you're learning a lot of video and you want to check for notification.

You want to check if they use or just log.

-- sure polling is good, but it's chatty.

Meet long polling and is being used for Kafka to effectively for clients to consume a topic in Kafka.

It does.

They do a short calling the consumer they call it the consumer will do a short polling.

Sorry, long polling.

The consumer will do a long polling request and it will just the Kafka will not respond immediately

until there is an entry in the topic.

Right.

It will then respond back.

And that's the beauty here.

So we're going to simulate this with an example in a minute.

So what is log balling?

The client sends a request, the server responds immediately with the handle, just like with the same

thing.

Right.

And the server continues to process the request and the client uses that handle to check for status

guys.

It doesn't have to be like, I'm giving you an example here that where there is a request and you submitted

a request and you're processing the request, but it doesn't doesn't have to be this way.

Like for Kafka, what they do is, you know the topic, right?

The topic is already there and you want to subscribe.

The consumer subscribes to a topic and the subscription works by long polling.

That means, Hey, I want to connect to Kafka.

And the the consumer sends a request.

Say, is there any topics in this topic?

Is there any entries in this topic?

They call it messages, I believe they call it.

Yeah.

Are there any messages in this topic?

Right.

And if there are aren't any messages for that partition in that topic.

Kafka blocks.

It will never reply.

So technically the client just keeps waiting.

So you did not really waste bandwidth by sending multiple pull requests.

The Kafka.

The moment Kafka gets a message and writes back to the client's response.

And that's how we call it long pulling.

You're pulling and sticking long time to pull in instead of short warning, which is immediately the

server, the back end responses.

The server does not apply until it has the response.

And that's the trick here and I'm covering here.

But it says we can disconnect and we are less chatty.

That's basically it, right?

So that's the beauty.

We can still disconnect.

And the beauty here is just we're less chatty.

There is no chatting us.

Right.

Of course, the next response, if you want another topic, you do the same thing.

You still call it a push with with Kafka did not work for them.

They did not like the push model because let's say you have a consumer and you connect it to a topic

and every time the topic has data you, it pushes the data to the in the clients throats, literally,

right?

The consumer sometimes cannot handle the volume of messages.

Right.

And that's the rabbit is the push model.

It was Kafka.

It's just long pulling.

Hey, let the client pull at their leisure.

Right.

So we're going to use long polling to avoid the chat in this.

And the client controls effectively the the data.

They did a flow.

And there is some variation that has time too.

Like you cannot, like, pull forever.

You know, you can, but you can, of course has a timeout, the client timeout, there is a server

timeout and stuff like that so that you don't wait forever.

Here's how long boring work.

You send a request, you get a request ID and then you said as ready.

Then you just sit there.

Server knows it's not ready.

The moment it's ready, it just sends out response, you know?

So it's a very long request response.

If you think about it, it's almost like you send a request and then you just wait it for a response.

But the beauty with this here is you can disconnect, right?

Unlike the normal request response.

Long polling pros and cons.

The pros is less chatty and then it's back end friendly, right?

Because back end doesn't like to be chatted a lot.

Clients can disconnect as beauty cons.

It's not really real time if you think about it.

And the reason is the moment.

If you could.

It is real time the moment we got a response.

But it's a.

If we got a message between the time I responded to a new topic and then I got in a message, the client

has to still make a request, a pull request to check if there are messages In this period, new messages

might have come in and you didn't really get them in time.

So if the client is delayed, it is not going to get real time messages, right.

This might be not a problem for you.

And this is where the tradeoff comes in, Right.

How about we do a long bowling exercise?

All right.

So I wrote this up and then, guys, I didn't want to write this, as I explained, because it's going

to take a long time.

So I wrote it beforehand and I explain it.

I know some of you enjoy writing as we explain, but it's the same thing effectively.

It's just to save own time.

So it's a same identical example.

With a short polling, except I wrote a function that's called check job complete on the back end.

And this joke is a promise based so that it doesn't look right and basically give us a job ID and it

just calls itself and then give a job ID and it checks if it's if there is no if the job is not ready,

it just responds with false.

But it waits for thousand milliseconds.

And the reason why is because if you don't wait, then the event main loop will be blocked.

Just checking.

Right?

Effectively.

And if it's ready, you just respawn what's true.

And then what do you do in the check status?

Right?

You do a while loop a wait check check job complete while it's default.

Just keep looping if you do this right.

Which is a bad idea.

Right, right, right.

The Node.js will just sit there and run.

If you do this, you can do this.

It will never finish because that will kill node node event, main loop synchronously checks that will

sit there and just pinned right.

It will never the event mail will never move to the next results to check the next of the stuff so it'll

be blocked.

So adding that extra second breathing gave it some time to breathe effectively.

And let's check this out.

Run the server.

Clean.

Coral.

Submit a job.

Got a job ID and then immediately submit the job.

The job, I'd.

Give you the job.

Look at that.

We didn't get a response.

We're just waiting here.

And if I go to the back end, I'm actually printing the progress here.

So we are at 50% right now, processing the job.

60%.

70%.

You know, 80%.

And let's go back here and wait for a few more seconds.

So every 3 seconds we get a job complete.

That's how you do long polling.

Very simple.

I wouldn't say simple, to be honest.

There's more nuance doing here, right?

We had to do some stuff here.

And effectively, because this is a contrived example in your packet, you might be lucky and you have

like some sort of a like a readiness, some sort of publish subscribe where you can effectively get

a push notification immediately when you get that and then you respond right there and then you can

do tracks here.

The timeout is just one.

We effectively move the polling from the client side to the server side, if you think about it.

Which is a local polling, But hey, it works.

All right, guys, That was the long polling used by Kafka.

It's very effective.

Consider using it in your back end applications.

So you know, the next lecture.