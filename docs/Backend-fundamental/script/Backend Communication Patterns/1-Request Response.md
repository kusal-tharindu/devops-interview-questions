Let's start with the first and the most famous communication design pattern for the back end request

response.

Very elegant, very classic.

And it's literally everywhere.

If you think about it, you make a request back in processes, a request, and it responds back to you.

There is I can literally make an entire course just talking about request and response because there

are so much going on in this request response.

You know, you need to kind of remove the layers and discuss more, but.

Maybe not a lot of time.

Let's talk about request response.

What is this really?

So in a request response model, the client sends what we call a request.

Even the concept of a request.

We really need to define what that means.

What does that mean?

Right?

If I am in a network environment, if I'm sending a request.

The client really needs to define what a request is.

And guess what?

The backend really need to understand what a request is, because you see, the data that you send is

not just one.

It's like it's not like mail.

And you send one thing.

It's a continuous usually in TCP, it's a continuous stream of data, right?

And that the server needs to pass the data to look for the start of the request and the end of the request.

We're going to discuss all of that.

But the concept of a request very critical here.

And then the server parses the request, as we talked about, because the server really needs to understand

the concept of a request because the client might have sent three requests.

So how does it know that this actually three requests versus one large request?

Right.

Where does the request begin and where does it end?

Is very critical.

And this is basically where us as backing engineer really need to understand this thing because believe

it or not, the cost of parsing request is not cheap.

We'll find out So earlier now, there's so much fun here.

We're going to have fun in this course.

Once we parses the request, then we have to process the request on the server side.

Now this is different.

Passing the request, understanding the request.

Right.

And then actually executing the request is different.

If you receive a get request, knowing that this is a get request is one thing.

Executing the request to fetch an API or query the database is another thing.

So these are the processing aspects of requests and the server.

Of course, once the process is finished, it sends the response back to the client.

Even the concept of response is very similar to our request.

How does the client know that this is where the response starts and this is where the response ends?

The boundary of a response also important?

Yeah.

And then client pauses the response and consume.

Then the client pauses the response and then consume it and does whatever it does.

Displays in a page makes another request as a result.

Simple stuff, right?

So the client sends the request and the server responds back with the response.

So these two arrows is exactly what we explain here.

Are there more stuff that I didn't explain?

Of course there are.

For example, some of you might already think about is this what is really a.

Where does the serialization comes into place here, where, for example, if I have JSON as a payload

or I have XML as a payload or I have a protocol buffer as a payload, this is actually it's it's I would

classify this serialized serialization and serialization as actually processing the request, if you

believe it or not, because parsing a request is just to understand, Hey, this is where it starts,

this is where it ends.

But then you have to do another step to d serialize whatever this content is to something I can understand

in my programming language in the server side.

But there is a cost to serialization.

Like, why do people move from soap xml to JSON rest?

Right?

One of the reasons is the expense of parsing XML is way higher than parsing JSON.

Actually parsing JSON is also slow.

That's why people move to a protocol buffers as a quick parser.

Yeah.

And this is where plaintext versus normal in a human readable thing comes into the picture.

Jason's nice.

I can look at it and understand it.

It smells nice.

I can look at it and understand it.

But the cost is the size.

The cost is a parsing.

We're still in Slide one.

Let's move on.

So where is it used?

Where is the request response being used?

Well, it's everywhere.

Technically, the web.

You know, when I say web is basically HTTP, HTTP is a request response protocol DNS.

It's a request response protocol.

You send a DNS resolution request.

Hey, what's the IP address of Google.com?

That's a request.

It's it's uses UDP.

It puts it in a message that datagram it has a query ID, Right.

And then when the resolver or the cursor actually finds the answer eventually after going through all

the DNS, I talked about this in my networking course in detail.

Once it gets a response, it writes it back to the client with the query ID so that we know that, oh,

this, this thing we just sent, that's the answer for this, because the client can send 100 of DNS

requests right at the same time.

So how do you know you don't rely on order ever when it comes to back end engineering at all?

Don't trust order.

Right.

That's why pipe lining has been discontinued when it comes to back end executions.

Just can't trust it, man.

Plus, there is a head of line blocking, so it's essentially same thing.

LS you send a request to the search server and then it responds back with the list of directories.

Request Response Remote Procedure Call RPC is a very classic kind of style of programming and it is

technically a request response.

You send a request.

And that request is basically a request to execute a method.

But this method happens to be in a remote server instead of the local machine.

So you across you, you cross the network to execute this to method and then gives you back.

And the reason why RPC was popular is because as a client writing code, as a programmer, I don't know

the difference between oh, this is a local method versus a remote method, I don't care.

And they want this abstraction.

Granted that the moment you introduce abstraction, you introduce our uncertainties, right?

Because like, why is this method fast?

So why is this method method slow, Right?

Because now, now you have to understand, Oh, this method is slow because we send it through the network

and defeats the purpose of me not needing to know that this is a remote procedure called leaky abstractions

is the worse.

And that's that's one of the things that you have to be aware of.

SQL The SQL language is a request response protocol.

You send a query to the database and the database processes.

Your SQL prepares a plan, you know, parses this equal, prepares a plan for execution, says, oh,

an index is good for this.

A bitmap actually index is very good and index only scan is good and all.

You don't want a full table scan.

You're asking for a lot of data, full table scan, and then it actually does the execution queries

all the data from the tables and then build the response and then respond back to you.

Request response.

APIs, all sorts of APIs, rest representational state transfer soap.

Simple object access protocol.

Rarely used, but still used in enterprise systems.

I've seen an enterprise system or not or one or two that uses soap if it works or works.

I always say that unless you are running into deficiencies, then you try to change.

Don't try to prematurely optimize things that doesn't need to be optimized as always.

My rule of thumb, GraphQL very, very popular and recently developed actually by Facebook.

And the idea here is just making packaging different requests into one so that you don't be chatty because

that's another kind of limitation when it comes to request response.

If you're needing to make a lot of requests, then you are taking the head for each request and response,

right?

GraphQL tries to solve this problem, which actually exists in rest, by saying, Hey, give me this

user and give me its comments and give me its its full name, and also give me everything that they

said in between these dates and rest.

The architecture is, do you have to make multiple requests?

Because every thing we describe is a is a resource.

And GraphQL says, Hey, send me a language specific syntax and we'll take care of it in the back end.

So the graphical technically still makes multiple requests, queries on to the database.

It depends if you created a view or not.

But so what GraphQL does is actually moves the multiple requests from the client to the backend to the

back end to the database.

Technically, right, But also because it knows that context, it can eliminate some of the SQL queries

on the backend and if it knows right and if configured correctly and it is implemented in a lot of variations.

So let's take a look about the anatomy of a request response.

How does it look like?

A request structure is defined by both the client and server and they have to agree on it based on the

protocol being used.

Right?

So if we take, for example, the git request, get slash the path and then the version of the protocol

followed by the header by the CRF carriage return and then the actual body, well, it doesn't have

body, but you get my point in general, this is this is how it looks like the server actually understands

this, parses it and gives you back a response.

Right.

So there is a structure that have to be agreed upon.

Why don't you do a request response?

Both the client and server has to agree and you have to write code to understand this thing.

This work is being done for us.

We technically don't sit there in the backend and pass segments to understand, Oh, this is the first

course, this is the single course.

It's all done for us as backend engineer by library such as HTTP library.

So whatever library you use if you're listening on a HTTP server Express uses it HTTP server for Node.js,

for example.

And that it does that work, it actually sit there and parses.

So all this work is being done in the app in your app, but it's just another part of your app is doing

it.

And guys, this is the goal of this course really it's just to have a clear understanding what exactly

happens on the backend from A to Z.

From the moment I get the first bite of a request, what exactly happens?

Because you see not only the code you write is what what is the backend is doing, Your application

is doing way more.

All the libraries that you reference is doing work.

And the key of understanding what these libraries do is the key to becoming a better software engineer

in general.

So nobody can actually trick you, right, Because you actually know what's happening and you can take

conversations to any level of this stack.

No, I know I'm going all over the place, but this is related request has a boundary.

We talked about it and it's defined by the protocol and the message format.

So the the protocol is where software it ends and the message format itself is also another piece,

right.

Which is the serialization and decentralization we talked about.

If it's just text, like HTTP is text, right?

Hyper text transfer protocol, Right.

So that's easy.

There is no parsing to be done right.

But it's like if it's JSON, if it's XML, if it's protocol buffer or if it's your custom.

Message format like you built your own binary format.

You can do that.

Then this this format has to be understood in both the server and the client.

You know it inside how to parse it, and not only parsing it, actually making it back into an object

that can be used in your app, you know, and JavaScript, we don't we normally don't notice that,

right?

But in C++, for example, if you use JSON.

As a transfer.

There is a C++ JSON parser that takes a bunch of string of bytes that looks like JSON and then actually

start parsing this JSON and then building it back to an actual C++ structure that actually looks consumable

to a programmer programmer.

That bridge.

Right.

And I've seen it in application dude, some Jason parsers.

If the JSON is large, it takes across 2 seconds to parse.

Right.

That's where you have to really get into like, good.

What is that good parser?

What is not?

JavaScript is the best because the passing of JavaScript is very native to Jason.

There is a cost, but it's fast.

How fast can it be faster?

That's a different story.

The same thing for the response.

Of course, the response will have a message format.

We'll have a protocol.

We have to abide by the protocol and we talked about the HTTP request.

That's how it looks like.

Yeah.

So let's say I'm going to build a back end application that uploads an image.

So I back in image service, I want to upload an image using the request response pattern.

Well, one way to do it is simple.

Take the whole image from the client and literally just send that entire image in the wire to the server.

That's the simplest part.

Problem is there is limits here.

Now can you send like a seven gigabytes image?

Is that like a seven gigabyte image?

What is it?

What kind of image is that?

But you give my point, right?

It's a large file.

There's limitation to that.

But you can you can do it.

That's one way to do it.

Right.

The other portion is the chunk, the image into small portions and send each request with its chunk.

The beauty of this is.

The old method.

The original simple method is not presumable so a few fail.

Guess what the the server of the back end was.

It will get like three quarters of an image and it will just quit.

Right?

Because it's like, oh, it looks like the client didn't send me anything and the collection got got

disconnected.

So I'm going to delete all this stuff, right?

It's not going to do anything.

It depends what you did in your back in application, but if you did it this way, the other method

where you chunk the image and you send it by each request and you chunk you mark the chunk with a unique

identifier, then the server will say, Hey, by the way, in case if you crashed, by the way, I got

chunk one, two, three, but I didn't get anything after that.

Is that, is that done right.

You would say for example, hey it's it's actually seven chunks out of, you know, seven total chunks

and we send so far three so you can resume effectively the execution.

This is the tricks you can play, but technically it still requests response, but the style of execution

changes.

So I can send the whole image, right.

That's one way.

Or I can send portion one go respond.

I've written this portion.

They're going to send another portion.

I get this bit and the third chunk.

And then finally the client will basically the server in this case, it will build up all of this chunks

and its vicinity.

Right.

And then assemble them back.

This is a very nice approach.

If a client disconnects, a client can come back and say, Hey, by the way, I can kind of write some

local information that says, Hey, I uploaded this and this, hey, you're missing this, and this

can ask the server and they can synchronize their state here.

There is no way.

But this is simpler, of course, right?

There is every there is always a cost to everything problem.

It doesn't work everywhere.

It's like, let's take a notification service, for example.

You want to build a notification service?

A notification service that say, Hey, when someone log in, I want you to basically tell me that someone

just log in or someone just uploaded a video, right?

Or someone just commented on my story.

Right.

The notification service with requests to respond doesn't really jive, right?

The problem is because the client has to make a request, but in this case, technically the backend

has the knowledge.

Right.

And the client doesn't.

So one way to solve it is to say, Hey, do I have ID?

Do I have ID?

Do I have an notification?

Do I have an interaction?

It works.

That's a request response.

Do I have a notification?

No.

Do I ID?

No.

Do I have a notification?

No.

That's called polling, by the way.

We're going to have another lecture talking about it, but it doesn't really scale Well, chatting application

do have.

Did someone just chatted?

Did someone to chat?

It Does someone just chat it?

You can't do that without a of response.

You can try, but there will be a huge latency and you're going to, you know, just spam the network

with empty requests.

And these empty requests can congest the network and you have other problems in your hand in this case,

very long request value, let's say very long running request to be specific.

Right.

So if I send a request and that request just takes a long time to process, I'm sitting here just waiting.

Right.

You can do it, of course, But it's better to use another style of execution than just a request response.

You can make it an asynchronous processing here.

We're going to talk about all of that stuff here.

Like an example is like, what if the client disconnects and we have a very long execution request?

The client comes back, it doesn't know.

Hey, is it done?

Is it not done right?

What am I going to do?

What am I doing here?

So.

There's tricks we can play here.

I'm going to go through all of this stuff and I'm going to solve all these problems with different kind

of design patterns.

That's the purpose of the section.

Yes, we're going to talk about alternatives.

So let's take a look at a visual right here.

You know, where I'm sending a request and I'm processing the request and I'm responding as a back end.

Right?

So this is the server, this is that timeline, and there's the request.

So if I actually mark this with certain times, I started t zero No, and then t two and that is like

a bunch of time he go to the time goes continues PT 30 and then PT 32.

The reason I did this in particular because I wanted to show you there are all the time being spent,

right.

So for instance, the client finished writing the request at the zero finished writing the request.

There is something here that I as I spoke this these words, that is something I missed to talk about.

Writing the request also takes time, right?

So let's say we start at T minus two.

The time to take to write the request also has a cost to it.

Right?

And once you actually write all the request and prepare it and then flush the changes to the network,

that's when we actually, hey, I'm done.

I just sent the request.

That's what it means.

I just sent that request.

This area, I mean serialize the JSON to a binary serialize the protocol buffers from my object to a

protocol port above all this stuff here and now we send it.

Look at that.

It's at an angle.

Right?

Because why?

Because the request takes time to arrive.

Right?

There is the cost of the network here.

The network takes time to transfer my request.

And my request doesn't look like an arrow.

Of course, on the network, it looks like whatever protocol I used right in the underneath it, like

as I use TCP, the request will be broken into small, what we call segment, and these segments will

fit into what we call IP packets and these will be routed in the Internet.

So all of this routing and some IP packets will arrive out of order and they have to be reordered in

the server.

All of this cost is accounted for for these two zero to RT two.

So the server eventually receives the request and understood it in this time basically so that that's

the time it takes.

But then we have the cost of actually processing the request.

So here the client is still waiting the moment we got the request and actually addressed to the request,

we went and started execute.

Up until.

Right here.

Right.

Right here.

3330s.

There were servers.

Oh, I'm writing the response.

I'm finished.

Let me write the response.

It started writing the response and finished writing the response.

It goes and the execution goes and the transfer goes and the client receives it in t 32.

And these are not seconds or milliseconds, just a unit of time.

And just for simplicity, it could be milliseconds, could be anything really.

But I just want to show you that the time it takes here.

So.

Although we finished execution.

The response here, we got it right here.

And this also includes the reordering of the response.

All the packets arrive in order and include you can add extra time here to say, hey, this is the cost

of passing the response and this serializing, this serializing back to objects.

Right.

So that's basically the request response.

All right.

How about we do an actual quick demo to show our request response?

What's what's easier than using Curl C URL, which is developed by Daniel Steinberg?

It's a very popular client library.

And we're going to just to query a page and we're going to use the dash dash trace to give us as much

information as possible.

Let's do that.

All right.

So I'm going to do as I'm going to call dash V and dash dash stress.

I'm going to do the output and out the text and then I'm going to do HTTP.

I'm going to specifically use SDP.

I'm not going to use PDBs because that's a different lecture.

I'm going to talk about TLS and all that stuff and let's say Google dot com, I'm going to actually

do that.

All right, So let's check out our outdoor text file here.

I did Cat to show the results, but look at that.

So what we did here is the following.

Let's.

Let's disappear here.

Just remove myself so we can see more.

And we can look at this.

So what we did first is we established the TCP connection.

We did a DNS to get the IP.

We did the Google.

We connect it to Google on Port 80, and then we started sending the headers and this is how it looks

like.

So that's the first thing.

See, the arrows to the right means we it's a request, Right?

And this request looks like this.

The get request, the method, the path we visited slash if I did a slash about is going to say about

here and they say http one one the protocol followed by a new line headers.

Right.

Host google.com, user agent curl and accepting everything.

And then once we're done with the headers, that's it.

There is nobody in the get requests, right?

You guys know this.

And if it's a post there will be another section to actually send the, the headers and the body as

well.

And then we can see that we got the response.

The first thing we got response and that's how gdb works is we get always the headers first, right?

So we got back the headers and immediately the server, the first thing responds back with the headers.

So we got http 11301 moved permanently, says Hey, google.com, it doesn't exist, go to this page

and instead go to WW dot google.com.

So this location will cause the redirect, but we don't redirect by default in curl so there is no redirection.

So that's the final result.

We continue receiving header.

See, we is the beauty thing here.

As you write, it's not like one thing you get a bunch of bytes and these bytes immediately get processed

by the client and says, Hey, all this is a header.

Look is that.

And then we just say, Oh, another header and then whoa, another header and then another header.

We see another header.

So these, all the headers are received, looks like one header at a time, but maybe this is how Curl

displayed it for us.

Maybe it got it all and then it just shows this to us in this format just so that we can understand

it.

But this is like the content length and all the headers are received and you can see the arrows this

way.

And then now we actually receive the data.

That's the body, write the response.

It's an HTML page of all the contents.

Hey, let's move permanently.

Go.

Just go somewhere else.

Right?

And that's it.

We're done.

So it's a request response.

Very simple, very elegant.

Right.

How about we move to the next structure?

I hope we enjoyed this one.