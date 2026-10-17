Perhaps in my entire career.

Synchronous versus asynchronous workloads is the most common thing that keeps showing up in when it

comes to execution and back in programming, you know, and even client side, you know, it's very

critical to understand, especially as a back injury, to understand what's synchronous and what is

asynchronous execution all boils down as can I do work while waiting for whatever I just did?

If I send a request, if I send a call, if I call a method, can I do other stuff as a process?

While I'm waiting for you.

Because if you send a request to process something, can I do something else by design?

When we first built computing, everything was synchronous.

That means.

It means that let me go full.

It means literally synchronous execution is like, think of it like a sine wave, right?

So like if to sine wave goes together in the same phase, that means they are in sync.

They are going in the same direction.

So the request and the response or the client and the server are in sync that they are going in the

same rhythm sort of speak, right?

Asynchronous means they are they are not in sync, basically.

That's what I mean.

Right.

And then we took this and we kind of changed this concept in programming to make it basically very,

very weak, ubiquitous.

It's everywhere when it comes to programming.

So just think of this.

This is where it came from, asynchronous motors, right?

Where the clock speeds are not really in perfect rhythm, but it's actually most of the time you're

going to find out that asynchronous execution is actually preferable than synchronous, because when

I do that, I don't want the server and the client to be in sync.

Who cares, right?

Right.

It's not like we don't have like a problem with phasing or electrical stuff, you know, to keep things

in sync.

That would be a disaster, right?

But in and programming, we actually want things to be asynchronous.

I want the guys to go do something else right and the server to do something completely different.

They don't have to be in sync.

That's the goal here.

Right.

So let's start with synchronous input.

Synchronous IO.

The caller sends a request and block.

This is the old, old, old ways.

If I'm in a process, I'm a caller and I send a request.

Right.

The request blocks me as a caller does nothing.

I can do anything else.

Not the code below me can cannot execute.

If there is a timer in the background, it cannot do anything.

If there is like another thing that needs to be waking up events.

If someone if the user clicks on a button remember the nineties if you if some of you like if you know

like when you build like a VB five application and you had like a loop that does something and everything

was single threaded back then, when you click a button while this process is executing the button is

even doesn't respond to you, right?

Because the active thing to actually light up the button to actually execute it cannot work.

That code cannot execute because we're doing something, we're blocked, we did something and we're

blocked and we have to wait for that thing.

Even if was carried from file, if the file is like three gigs, you cannot do anything else.

That's the original, original, original.

Every now it's not it's not the it's not the case.

Right.

Right.

That's why in VB five, I don't know if you guys remember, it's like this is my first language.

That's why I use it.

We used to had a header called Due Events.

Due events will make things asynchronous.

Even if there is a blocking operation, it will allow the the UI to actually be responsive.

So yeah, synchronize IO request and block and the process basically is blocked.

It cannot do anything.

That means if if if this happened in the CPU, if the process is being executed in the CPU because the

process is what it's a set of instructions.

Right.

And the moment the, the process sends IO to read for example from disk or from the network.

Again old days.

Right.

What happens is the CPU will say, hey, you're not doing anything, you're blocked, so I'm going to

take you out of the processor.

Right.

You're not executing anything.

There is no instructions for you to execute.

I'm going to take another process that has something to execute and that's called context.

Switching right where you were in the CPU were sitting in the CPU and the CPU are giving you generous

execution time, but the moment you do an IO execute, it kicks you out.

It's a set.

Sorry.

Synchronous, I Oh, get kicked out.

So caller cannot execute any code.

Meanwhile, we talked about that, and then the receiver actually responds once.

Once the receiver not notice that I said, caller on receiver, I don't want you to client and server

because the asynchronous workload is everywhere.

It doesn't have to be a client and a server.

You know, they are disconnected.

You can have asynchronous calls in your operating system right now.

It happens all the time in your program.

There is a synchronous execution that once the receiver responds, the caller will be unblocked and

the operator, the operating system, can put your process back to execute the rest of your code.

And this is where the caller and receiver are in complete harmony.

They are in sync effectively, right?

Because if you think of as as your program is like a list of instructions and the pointers like there's

a pointer pointing to the server, the receiver side and there is a pointer point to the caller side,

they always just execute, took, took, took, took.

They are in sync.

Right?

But if if it's asynchronous, we're going to notice that the client can move on while the server is

actually doing other things.

They are asynchronous.

But don't don't worry about definitions and all have to remember this.

This is just, for example, sick.

Right?

So an example of an OWS synchronous IO.

Let's take an example.

So program asks an OS to read from desk and the program manager is taken off the CPU.

Actually, we talked about this.

Right?

The program main thread is just hey, you're reading from desk.

Well, if you're reading from desk, I'm going to make the call to make read from desk, but I will

take you out of OCP because that's the only thing you're going to do.

Meanwhile, as a colonel, I'm going to move on and put other processes in the CPU that is more important

than you write because you're not executing anything.

You're blocked again.

Synchronous.

Are you talking about synchronous here?

Raid completes and program can resume execution.

The kernel can put the program back to the CPU.

It depends if there are other threads executing in the CPUs guys get a wait.

And so the context switching for we're switching context from the threads and from the CPU and then

put it back.

That's costly and.

When I say costly, I'm talking microseconds, of course, but I do it a lot.

It adds up.

So it is a Node.js, some sort of a synchronous IO where we have a do work here.

Not just a bad example because Node.js is an asynchronous thing, but.

Let's assume this is actually a blocking code, right?

If I.

If I do some work here.

Like, let's say I'm going to use the program to CPU, execute something and then done, I'm going to

move the execution down and then we'll get rid of the file.

The reading.

The file technically is not me doing it as a program is a request to the kernel, which then the kernel

talks to the driver, which which talks eventually to them to the disk controller, which is whether

it's an SSD or hard drive.

And then it does the execution.

So it sends the request to the device and the device does the reading and the kernel just waits there

for right for the response from the device, from the SSD.

So neither the kernel is doing any work nor actually the application is doing any work here.

So that's a complete waste of time.

Right.

Why do you block me here?

Why did you take me off the CPU?

I'm just waiting.

I'm not doing anything right.

And that's where we try to solve it with asynchronous execution here.

And then once the program resumes, once that is done, program resumes, we get the results.

We do something with the read file and then we continue.

Let's talk about asynchronous input output, asynchronous IO.

The colors and request the color gets can work until it gets a response.

Here is the beauty here of asynchronous IO and then the caller either here.

There are two choices.

It sends request and just moves on.

But the question becomes here, how does it know that it got back a response or not?

There are two ways the Corps can check if the response is ready.

And this is very popular in in in Linux called Apple.

Right.

There is Paul and select Paul and Paul.

Right.

Which says, hey, audio ready?

Audio ready or ready.

And then they changed it to Apple, which says, hey, here's a bunch of devices that are just read

file descriptors and says, tell me when it's ready.

And so both of these cases are check if things are ready for me to actually perform a raid, but that

is non unblocking, right?

And the the other way is just the receiver calls back when it's done and that's where the either windows

which is the IO completionist ports I believe IO Aosp or the new thing in Linux called IOU ring which

is hey, when it's done, we're going to write it right here.

This is the completionist queue.

You're going to know if things are done.

It's right here.

So two ways to do it.

To find out if your synchronous work is done, asynchronous work is done, and Node.js.

Since most of you guys knows use Node.js.

Actually Node.js uses Apple in case of Linux and in case of Windows, if you have running on Windows,

if you use any, use the completion ports.

Another trick that actually Node.js does is when it can't do a pull or can do the completion stack,

right?

It actually.

Let someone else be blocked while itself not blocked.

Right.

That's a trick.

If you think about it.

It's like if I can make asynchronous IO as a main thread.

You asked me to read a file.

I know reading a file is a blocking operation, so I'm going to let someone else do it.

Who I'm going to spin up a thread.

Got to spin up a thread and let that thread reed file so I'm free to move on.

So this is a trick that seems to the consumer, which is you, the programmer, as an asynchronous IO

because the main thread is unblocked, it just spends up a thread.

Let the thread does the reading and the thread is now blocked, which basically a thread asks the operating

system and the operating system as the device controller and the controller is now doing the work.

But the OS took the thread out of the execution, but the main thread remains in the CPU.

See.

Software is full of tricks.

Computers are dumb, and we play tricks on them.

So that's another way to do an asynchronous IO.

As long as I can move on while waiting.

That's the trick here, remember?

And it applies to everything.

By the way, the caller and receiver are not necessarily in sync.

That's the that's the code in code.

Why it's called asynchronous.

They are not in sync.

Who cares?

We don't want them to be in sync.

So here's an example of asynchronous call in Node.js.

So program spins up a secondary thread.

Secondary thread reads from disk.

Of course the OS blocks it, it being the secondary thread, the mantra is good, right?

So I can still continue doing my events if there is a UI.

I can respond to the UI.

If there is someone sends, I get a request.

I can pull that or get requests from express, do stuff while I'm waiting and the only the secondary

thread being blocked.

So in Node.js now this is Node.js speak.

Of course Node.js has by default spins up I believe, four worker threads that the level of library

that they use and I think it's foreign configurable of course don't exceed the number of CPU that because

that's pointless right.

Because the maximum number of threads has to work on the CPU, the more you have you can play tricks

with that.

That's a different kind of.

Topic altogether.

You know, if you know that your IO bound Nazi P you bound, you can bump up the number of threats.

But in general, just understanding that it comes back to understanding your guys, right?

Understanding what the back end is doing you as an injury can configure the heck out of it, you know,

and you can optimize and squeeze all the performance.

If you don't understand how things work, you can't optimize anything.

You just you won't be able to know what's happening.

Oh my, this is slow.

I have no idea why we don't want that.

We want to pull the curtain and understand everything.

That's our goal.

So the main program is still running and executing code, all that.

Of course, the Janz thread finished reading and calls back the main thread.

That's how it does, right?

Hey, I'm done man.

Thread.

You can execute the text, the result and then ask calls back.

If you think about it, code call calls back.

The caller How does how this is done?

This is the old way.

It's still tried and true and this is the actual Node.js right now.

Right?

So do those homework.

Execute here read file.

Right.

We're going execute, read, file, read this large void dat and then when I'm done, call this on read

finished and with the file the whole file binary.

Right.

And then the moment I execute this, it's done.

I'm moving.

The file is not done.

Reading the file is not done.

What happened here is we spun up a new thread.

Technically, the thread was there already.

Now just spins them hot to make them hot.

Right?

And then it was a schedule.

Go read thread, go read it.

And when you're done, please call back this function.

So if you have a function immediately this function will get called out of the blue.

So someone just called it or done and then we've move on.

We did do work, finished, right?

And then later in the time on read finish I can think of we can see this only finish will be executed.

Cool stuff.

The the the new approach is to do promises where it's very similar to you know.

Two callbacks, but read file, if you do it as a promise, you can basically immediately return a promise.

A promise in Node.js is very similar to futures and C++, I think.

So, hey, here's a future promise that hey.

Take that and whatever you call dove then on it, I will call that dot then function.

It's a callback, but it's just nicer looking here.

And then then even the newer approaches to do async await, which is still asynchronous.

Right.

But the good thing about async away, it will look synchronous to you, so away it will actually block

you from executing the rest of the code.

In the vicinity, but it's still the minister is not technically blocked.

You know, it can do other stuff here.

So here's some no jazz lesson for you guys.

So async await.

Right.

It's just it's a waiting.

It's not really blocked you because sometimes you want the code to be in order.

Right.

And if you do it asynchronous isn't there.

No.

It's like the rest of the code depends on this value.

Right.

So you want it to code and go to block, Right.

Wait here until we get the result.

But we're not really waiting.

We're not blocked.

We can do other stuff.

We just this style of programming shows us as it's block.

It's just a preference just to shunt syntactic sugar, nothing else.

All right.

We're just playing games here.

So synchronous versus asynchronous and request response.

Let's talk it.

Let's take it to the next level.

Synchronicity is really if you think about it, it's a client property.

So we talk about synchronous versus asynchronous in in method calls.

But let's take it to the request response where we have separate entities, the server and client security

is always almost like a client property if you think about it.

Can I wait?

Can I continue working while I wait?

So most most of the clients today, almost no client library when Since the network call is synchronous,

we don't have synchronous anymore.

It's always asynchronous because we know we send a lot of requests and network calls and we want to

do other stuff while we send the request.

And that's where async await, you know, where fetch Axios.

All of these libraries are all asynchronous now, so clients in TV request it does though and continue

doing work.

Right?

So you can send a request execute code locally other stuff and then it gets a response and some callback

is getting called whenever the response is getting executed.

So there is the in Node.js specifically there is an event loop main loop that checks out.

Do we have a callback?

Is there, is there a callback?

Is there a callback Right.

Is there cable, Is there, is there some work?

Is there a timer?

Is there this?

So it just it is a loop that always running and checks all this stuff.

All right.

So maybe this is still confusing sometimes.

Like to me it was always confusing, synchronous and etc. until I found some really nice example in

real life, actually.

So actually, synchronous communication is when the caller waits for a response from the receiver and

technically doesn't cannot do anything else.

Right.

That's why we define synchronous communication as So what does that look like?

Looks like asking someone a question in a meeting.

Is actually synchronous because it will be awkward.

Like if they say, Hey, hey, John, did you actually send that Paul request?

Imagine if John doesn't reply to you.

It's awkward, right?

It's just weird.

It's like I'm talking to you right here.

You have to reply right now.

I can't.

I can just ask a question.

And that's just like, Wait, John, where is you?

Where are you?

I can just move on.

It's like, it will be really awkward.

All right, so that's synchronous communication.

Flip it to the other way, right?

Actually is asynchronous communication, which comes to email.

Really?

If I send an email, I'm not sitting there, I'm waiting for a response.

Right?

I can do other work.

Right?

So that's asynchronous communication.

So email is an example of asynchronous, you know, where meetings, especially meeting.

You can also argue that chatting like in teams or Slack is also asynchronous, right?

But sometimes also sometimes becomes if you're engaged in a quick chat with someone, sometimes they

apply to you immediately, sometimes it's synchronous.

So yeah, that's another example.

I thought I throw it in.

I like I like to pull from real life example, but technically asynchronous workload is everywhere.

And here's where I give you some examples from my personal experience where.

Many back end applications and operating system level stuff.

So we talked about asynchronous programming.

You're familiar with that probably right where you in the language we use a promise or async await or

a future and we can continue doing.

We mark the function as async and we move on that.

Now this is an async function, so when I call it my program process is not technically blocked and

that's the beauty here.

So that's one way.

That's when approach another approach is asynchronous backend processing, right?

So if you look at this from a back end execution and then and then a client sending a request to the

back end, if the request is longer running the backend, even the back end is actually executing that

long running process.

There's spending a lot of time executing that.

And and the client, technically you can argue it's asynchronous, it moved on, right?

It's doing its own thing, but it's technically still waiting for a response.

Right.

There is there is an event that needs to be triggered because it's waiting for the back end.

So the client is asynchronous, but the whole thing, the system is synchronous.

That is synchronous processing, right?

Because you're technically the backend is still thinks that, oh, someone is actually waiting for me.

Right.

I got, I got to finish right.

So there is a trick to actually move.

The lens is like a lens.

You're looking at the client now.

Now move the lens to the back end.

To the back end.

Someone just someone actually there is a handler in the back end that say, Hey, execute that to the

back end.

That is synchronous because, hey, whoever called this is waiting for a response.

So what you can do is flip the equation immediately.

Response.

What do we do?

How do we do that?

Right.

The most popular thing is called QS, this beautiful data structure.

If the client sends a request, we will not promise to execute that request immediately.

And instead we're going to put that request into a queue.

Flush it into a queue.

Why?

Because the backend can't process can promise to actually process it right now it might doing might

be processing other requests.

So you put it in the queue and another request put it in the queue.

So you have a queue of request.

Right.

And the client meanwhile immediately is blocked, is unblocked.

Sorry.

So the client immediately gets a response.

Hey, I queued your queue program.

You can even disconnect if you want.

I'm good.

And here is a handle.

Here is a job ID.

Here is a promise.

Sounds familiar, right?

That is exactly like how it works locally.

Where if I call it a norges and it gives you a promise back.

Right.

I can check that promise, Right, If it's done or not.

In the back end execution Here you send a request, you immediately responds with a job idea.

Hey, here's your job ID, check back in a few minutes, write this, check back.

Even that is in its own ward.

How do I check back the job if it's done or not that we're going to talk about in another lecture.

It's like there are many, many ways to do that.

Push, pull long, pull, pull up, publish, subscribe, you know, all these beautiful things.

But that's that's backend processing.

This is called asynchronous processing or asynchronous backend processing because we're focusing on

backend engineering here, right?

So I care about the backend here.

So that's asynchronous backend processing and you might be familiar with that, right?

If you use queues where you send request immediately get queued and you get back to the job ID, clients

can disconnect and save the job somewhere in disk.

And then if it spawns back up, it gets that job ID and it says, Hey, hey, hey, backhand, did you

finish this?

Is this done?

Yeah, it's been done for four or 5 minutes right now.

Here's the response.

Tricks.

It's all tricks.

Technically, the request to check if this job is done is a request response.

Also, the first call is also a request response.

So we just did a request response to once we split them.

Sometimes we're going to merge them, sometimes we're going to split them.

And all depends on what we were trying to do.

Asynchronous backup processing.

Very, very, very popular mode of operation.

I know, I know a lot of light bulbs are going into your heads because this course was designed, of

course, for intermediate levels to advance.

So I expected you to build some few applications before taking this course.

So it can you can relate to these things.

If you're new to programming and generally you might it might be a little bit difficult to comprehend

some of this thing, but ask questions.

That's what all my Udemy course is.

I try to answer the question within a day or two because most of the questions are actually very, very

good question.

Right.

No questions are usually out of the blue, all related to the course and all are useful.

So ask questions.

Don't hesitate if you have any question, submit that question here, so take it to the next level.

Postgres One of my favourite database, you know, database systems actually have something called asynchronous

commits.

Whoa.

These are when one fancy little word here we know what is a commit guys let's talk about commits here

commits.

When I have a transaction, I begin a transaction and I write update this file.

And so this table unsorted another table.

And so to add another table update another table read from this, reading from this.

And then finally, all the changes that I made is actually being recorded in something called the Wall

or the write ahead log.

It's a journal, a journal of changes, and that's it.

There is another data structure that's called the pages where the the actual all the results are actually

living with the full columns and everything.

And that's a different data structure.

So we have the wall small, tiny, usually compressed, and we have the pages which has the actual page

and all the columns and the rows and all that stuff.

Right?

So the post occurs when you actually write it, writes to both, writes to the page, and it also writes

to the wall.

Right.

And but it only writes all of this stuff.

It is in memory right up until you say commit.

Usually what we say when we say commit, it's enough to commit the wall.

Even if the pages are in memory, it's enough to commit and flush the things in the wall, because that's

what the changes these tiny changes, even if it in case of a crash, we can recover from the wall and

we can just read the walls is okay, what was the last good state?

It was these pages.

Read them all in memory, reapply all the changes from the wall to the pages, flush them.

You are inconsistent state you recovered write durability.

That's one of the asset properties.

Check out my database course if you're interested to know more then.

So this is a commit.

The goal of the commit here is in postcards is you unblock the caller who calls commit because the client

will say, Hey, I'm ready to commit.

Boom, commit.

And when you say commit post Chris will call.

This commits asynchronously by default has to be simpler.

So the client blocks right.

Of course the client can do other stuff meanwhile, but the client to the postcards is being blocked.

Right.

So synchronously and postgres will only unblock and return the result the hey succeed or failure.

If the wall has been flushed to desk, not to memory to desk has to be just go directly to the desk

and the database is actually skip the operating system cache.

It just goes directly to the cache to the to the desk, I'm sorry.

And then write the disk.

And then once we write to the disk with their hard drive or SSD, then we retain success.

That's costly because the work can be large.

So that's called synchronous commit asynchronous commits in.

Postgres will say this because transactions, if you have a lot of small transactions, let's say you

don't have transactions, let's say you just insert immediately or update immediately.

Technically there is no something called just insert we in the back end, the database always starts

a transaction for you always, even if you didn't specify one.

Right?

So technically, if you do an instance without transaction, we begin right and then commit.

That's what that's how it works.

Auto commit effectively is on.

So in Postgres asynchronous commits once the transaction is logically completed, all the structure

updated in memory and then we built the wall.

Right?

We will attempt to write the wall, but immediately we're going to return success before we wait.

We don't wait for the right operation to disk to actually succeed.

We just write it and then hope it will succeed.

And and we return comment immediately.

So the moment you say this, Oh, this is dangerous, of course the transaction could we can return

success to the client and saying, hey, success.

But what will happen on that on the back end the write might fail to disk later or maybe the server

crashed and the wall was in memory.

We lost it.

And in that case whoever read the committed stuff will rereading Dirty Reads.

This turned into a database course now with all the stuff, but it's asynchronous.

Get it because we immediately committed returned and then the focus moved on to do other things.

The client moved on to other do other things asynchronous commit asynchronous.

I own Linux.

We talked about this a little bit.

So there's Apple that is IO unlink as well, where if I want to execute a read or a socket read, for

example from the network, I can ask, I give the file descriptor representing my socket that I listen

to says, Hey, is there someone, is there something to read?

Is there something to read?

Is there something to read?

Or I can just say I want to execute a read, but I might be blocked because the moment if you if your

call a read on a file descriptor that is a socket say I want to read from this network maybe someone

just sent me something If you call read by default without anything, it will be blocking.

You will be blocked.

So if you do it asynchronously, you flag the socket as asynchronous, then what you're going to do

is just ask the socket.

Hey.

Tell me if this socket is actually has something to read.

Right.

So this is called EPEL, right?

So say whenever these file descriptions are a bunch of them where they are already.

Tell me whenever they are ready is different than is actually complete, that it is not completed.

It will tell you that there is something waiting for you in the kernel to be read.

Right.

So when you read actually it's going to take a few microseconds to move it from the OS down to your

application.

But that's very fast.

You can argue that this is also synchronous, but but technically.

I'd rather do it faster than actually being blocked until someone send me data.

So that's the apple.

Of course, Apple doesn't work with files.

That's why I was invented.

But this is not an operating system.

Of course.

This is another complete course by itself to understand all this thing I o you is actually works on

completion instead of readiness.

That makes sense.

The OS will do the reading for you in this particular case.

Asynchronous replication, That's another one.

Replication is the idea of having a primary writer in the database and a lot of, you know, secondary

worker databases that are performed for read.

So if I write to the my primary database, I say I begin a transaction and I write right, right, right.

And certain certain certain sort update update rules.

These updates will be streamed to all the replicas, you know, as as I'm writing.

So the replicas will receive these changes, but then the user say, Hey, commit if I say commit.

There are two ways to do it.

There is this synchronous way the synchronous replication commit where synchronous replication is.

If you issue a commit, write the main transaction in the primary doesn't actually commit.

It will send commits to all the secondary.

Hey, commit, commit, commit, commit, commit and this is where to to phase commit comes in and three

phase commit and you know paxos and all that stuff.

Right.

Well say hey, commit comments, come in, come in, come in, come in.

And only if all of them or the majority has committed, then I'm going to commit.

Get it?

So the trans the client actually is blocked while it waits so that synchronous it's blocked a client

who says, Hey, commit this replication work, it's waiting so you can do it asynchronously.

You can configure asynchronous replication at a cost of consistency, right?

Well, it says, Hey, if I ask you to commit, you mean that's your your what matters?

Please just commit and return.

And then asynchronously in the back end, just issue your commands and make sure everyone actually gets

the data.

But I don't care about them.

I care about you.

I care about you committing.

Give me the results.

So and even in that, you can also enable asynchronous commits.

In that instance, different things.

So asynchronous commit in the level and asynchronous replication.

You see, asynchronous work is everywhere.

Guys.

And finally asynchronous or sync.

So the database people actually I don't know if you know this guys, but when you write a file to your

operating system, it doesn't actually go to disk immediately.

It stays in something called the OS file system cache.

So whatever the file system cache write in DFS or what other thing the Linux don't you use a exe right?

Whatever it stays, there is a cache in the OS that the right goes to and forms of pages because we

try to write in pages and then asynchronously the operating system will wait for a lot of writes in

the memory and then flush them all together.

This is without this, it's going to be a problem because all writes will go to the disk and you're

going to you're going to fragment your disk.

You're going to be a lot of cattiness in the disk because all the writes like let's say you're going

to change one byte, right?

You'll write one byte in page one, right in this file, and then you're going to save another byte

and then save another byte.

This will be transferred into three writes to disk and and in the this SSD you Troy that is really bad

you know you try not to there is a shelf life for each page the erasable unit the erasable unit and

the SSD have a shelf life and the more the more you write to the same page, first of all, you have

to erase it because the moment you discard it, you have to write somewhere else.

So if you write a lot to the same block in disk, eventually dies out and there's there is a, there

is a there's durability to this SSD.

That's why the OS tries to minimize the amount of write by batching them in the cache, which is a good

thing.

But database people don't like this, right?

If I, if I want to ensure strong consistency, I write, I write, my wall changes, you better flush

them to disk the moment I tell you don't go through the OS cache.

No, I don't want to wait for 200 nanoseconds or 200 millisecond.

I don't want to wait.

I want to flush.

I want to make sure it's in the disk.

Right.

That's what the database people ask for.

So there is this f sync property that you can turn on or off to skip the OS cache and Linux Linus driver

hate hate it really they don't like it doesn't like really anything about to go with database people.

He thinks that the database people will actually run Linux.

I think he actually mentioned it twice because all these workarounds and hacks.

How about actually do some demo?

No J.S. blocking call with a loop and doing some fetch.

How about we do that?

All right, guys, let's how about we actually create a quick Node.js application that shows synchronous

and asynchronous execution where all the source code will be available for you guys?

I'm going to share it there.

So let's say Node sync a sync, right?

Let's go recreate Sync Dot Jazz and I'm going to create another one called async JSON.

And then in the Sync Dogs, what I'm going to do is do a constant FS equal, require FS, let's get

the FS library and then do a console node log one and then.

They say, I'm going to now read a file, so let's go ahead and create actually the file here.

There's the text.

Some text here.

And now what I'm going to do is first read file.

I'm going to use the sync version of the file.

It's the synchronous version.

So let's read through this here.

Returns the content of the path.

For details on operations, see the documentation of the asynchronous version of the file read file.

So what this does is actually does it async synchronously.

Right?

And of course read file sync is platform specific.

Of course it changes.

Right.

But but all remains the same where it blocks effectively.

Right.

So let's go ahead and read the test text.

Read the file, and then once we're done, I suppose I can just do console log, do that and.

Uh, or just do this contest result.

You call this and then console that log.

File do that.

Right.

And then console that log, too.

And so what should be the result here?

Let's go ahead and do this.

All right.

So let's try to run it.

Node, Sanjay.

You can see that we executed one.

Then the file is red.

We're block.

The two wasn't executed.

Right.

And then the two was executed.

Very simple.

So let's go.

And the reason is because we we were blocked right here.

We're physically actually blocked reading this file because it's a synchronous.

The main event loop is actually executing this and it's blocked reading that.

So careful doing that.

Right.

So now let's do it.

The async.

The async is actually just doing read file.

And when it's done, I want you to go and console that log.

I think that works too, because that will pass in the whole object.

So it's going to we're going to get more than the file, but so a very similar but asynchronous execution.

So the file will be read whenever it's ready is the console.

The log function will be called and pass in the file.

Let's see what was the was the result here.

In this case, Node is saying, oh geez, let's do zoom in here and run and you can see that one, two

and then the actual buffer here, we read the whole file basically.

Oh, yeah, we're going to read the description next time.

So the callback looks like the error and then the data, right?

So you have to do it this way, error data.

And then we are caring about the data.

The reason we got null is because basically there was no error.

So let's do it again.

Hey, go.

We got Buffer.

I suppose we have to kind of decode this.

Let's do data to string.

Here you go.

We have we got to convert by default.

We get arrays, the actual buffer object.

We just need to take the buffer object and take it there.

But the execution is what matters.

One, to lower them, right?

So one was executed.

This was scheduled to was executed.

And then the this function was called.

That's basically the difference.

So that's basically the difference in async versus synchronous execution.

Of course, we can take this to the next level.

It's everywhere.

Asynchronous execution is everywhere.

See you in the next lecture, guys.


