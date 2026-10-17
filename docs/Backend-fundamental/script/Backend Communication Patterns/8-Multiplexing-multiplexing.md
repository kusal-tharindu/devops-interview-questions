Multiplexing versus the multiplexing.

Although this is pure networking speak, it kind of it's really nicely in the discourse talking about

multiplexing and multiplexing in popular protocols such as HTTP, such as Quick search.

It's this style of connection pooling, you know, and also the the new protocol that's called multi

path TCP, where we have multiple paths presented to the user as just a single path, a single TCP connection.

Beautiful to look at this from a different lens, to look at this from a concept of multiplexing versus

multi d multiplexing.

Let's take a look at that.

So what is multiplexing?

What is the amount of vaccine?

If you have a lot of requests, a lot of signals coming into a box, right.

And if you shove all these signals into a single line, then this is called multiplexing, effectively

taking multiple lines and then merge them into one.

Think of these as three connections.

For example, three TCP connection.

And this is the one TCP connection.

So you're in this case your multiplexing.

Think of this as three user events.

Hey, the user sent one request three requests for request this.

You're now multiplexing all of them into one connection that goes to the back end, Right?

And the reverse is the reverse.

You have one thing with three different connections, three different requests.

Now you're multiplexed them to different clients effectively, Right?

So that's.

That's the multiplexing.

This is multiplexing.

Why am I talking about this?

What's the critical criticality here?

Well, it's actually shows up everywhere.

So if I have a simple HTTP one one server, right?

CDB one one.

If the user sends three requests like the actual user working with Chrome in this particular case,

let me disappear for a second here.

If the user sends three requests, request 1 to 3 right through fetch or Axios, through the web app,

through XML, STB, the request or.

Oh, there's JavaScript that sends multiple requests.

These requests goes to Chrome, and the Chrome actually physically opens multiple connections, and

in one it should be one one the first version.

And these requests are just pipeline to every connection one by one.

So of course one goes to this connection or goes to goes to this connection and so on.

And this goes to the HTTP one one server.

But however, in in in SDB two, right.

We talked about this limitation in the server center events right.

There is only six you can open here in the chrome at least.

Right so.

In.

It needs to be two.

You only have one connection and you can multiplex these requests into one pipe, one connection, one

channel going to the server.

So you have three streams that is fed to the server multiplexed from the user.

So this is multiplexing or multiplexing down and it shows up also on the back end.

So let's say we have a reverse proxy, let's call it envoy, for example, or in Gen X, right?

And then we have the actual HTTP two server here on the backend, right?

So this, the front end of this proxy is each one to be one one and the back end is each two, right?

So if I am connected to the reverse proxy directly, then I establish three TCP connections, for example.

Right?

And I send all of them in parallel.

The proxy.

In this case it will establish one TCP one HTTP two connection, which is a CCP connection, and then

multiplex this into the back end.

Right.

The beauty of this is you kind of have one connection to the packet.

You have fewer number of connections.

But the the limitation of this, at least the STB to when we're going to talk about STB two, we're

going to see this limitation as.

When I found out that this is actually put some load in the CDB to a server because the CPU needs to

stop parsing this request from different from the same connection and that takes time.

So you get more throughput but at the cost of more resources here.

So let's talk about the multiplexing.

So if you actually flipped this, right.

The multiplexing actually, if you flip this, you have an edge to edge to connection from the client

to the front end of the proxy, the reverse proxy.

And now all of these are multiplex, as we talked about, but now the client gets that and then it multiplexes

them to the server.

Each request goes into its own connection.

So I wanted to show you this diagram so that when they show up in your work or your, you know, engineering

tasks, you are aware of these multiplexing because there are advantages and disadvantages of multiplexing.

It's really it's really good to have each request goes into its own connection because it will this

will have its own rules and flow control and congestion control.

This will have different rules.

So they they are not affecting each other compared to this where it's sets in the TCP connection and

it's abides by the rules.

That's no longer true by end.

Quick though, and.

Connection pooling.

One of my favorite things and very, very popular.

You know, connection pooling is is a technique where you can effectively spin up multiple.

Database connections or it doesn't have to be database.

Really?

Right.

If you have a database server here and you have a backend server web server, and we need to execute

some queries to the to the postscript server, you would establish X amount of connection, keep them

hot.

And when a request comes in from the client, we will pick a free connection.

Right.

You have four in this case.

And when we send the request to and then yellow the yellow request text, the next connection, the

orange, the pinkish request here goes to the third connection.

So we're going to have a pool of connection instead of establishing connection on request and and all,

instead of having one connection competing.

Right.

With many requests, we're going to open a pool of connections, right?

Genco effectively doesn't do this.

It does.

I don't know if you if you're familiar with Django, the Python library, it uses just a single connection

per thread, which kind of is very limited in this case.

Right?

You're basically at the mercy of the threading architecture in your backend, right.

But you can effectively split up another backends multiple connections and have them this way.

But now if I have this purple request at a web request to do a slash arrow comments.

Right.

Hey, these are busy now.

Let's say we didn't get a response yet.

Hey, there is a free connection.

Use it to send to seek the SQL query in this in this database connection.

But then another red connection.

Now we have four of them are busy, and let's say the max is for connection pooling.

Here's what he did, which is that we maxed it out.

And you can see that this is effectively the multiplexing, right?

The connection pool is just the multiplexing.

It's a glorified multiplexing style, right Where we have one, we have kind of one pipe coming here,

maybe one connection, but we are multiplexing the request on the back end.

Right.

So now the request will actually be blocked, right?

Yeah.

It arrived in the backend, but it cannot be served because all of these connections are busy.

So that's basically what kind of simple is very popular.

Consider using it in your style of programming.

But now let's say this request is done, The request is done.

We got a response.

We responded back to the client.

Now one connection has opened up and that we can send the that request, right, the SQL query on that

empty connection and that idle connection.

Let's say you might say, Hosain, why can't I send multiple SQL queries on the same connection?

Why do I have to wait for that response?

That's a whole different discussion, to be honest.

If you send.

The.

Let's talk about it.

Sure, why not?

If you send like seven, if you send three SQL queries on the same connection.

Right.

And the Postgres server receives SQL.

One, two, three.

Let's assume they received an order.

Write SQL one is equal to six.

Three will get executed.

Right.

Let's say SQL one took 7 seconds, right was equal two and SQL three Finished first.

Right?

Took a second.

So SQL two will be one because we're not going to wait is going to respond to you with SQL to right

the SQL two response.

How does the back end know that the response we just got is is for SQL two and not for SQL one?

Right?

You have no idea.

The order is not guaranteed.

You can.

You're talking to a black box, boss, Chris.

You are at the mercy of how Postgres processes equals.

You cannot just send seven requests and say, Hey, whatever is coming, I've got to come.

You can play with tracks saying that you can tag the sequel with certain ID and make sure the ideas

come back.

You can build that as your back end, but without that right, you can't effectively do it.

Pipeline actually has been recently supported.

The Postscript 14.

If I'm not mistaken, they start supporting the idea of pipeline, which is this like sending multiple

queries in the same connection and having them be response in order effectively.

So let's talk about browser, the multiplexing in HTTP one.

One.

Right.

So this is kind of we talked about it, we talked about this limitation actually be on one where we

have only six connections, right?

So we already sent one request, one request to request three These connections are busy, right?

Remember the server center event case is a reverse I here and if you send more request you only have

three connections.

So if you send another three requests this will be busy.

Right.

And if you send more and more requests, you effectively don't have any resources left and your request

will be blocked in this case.

Right.

How about we actually do a demo showing how the browser connection pool in HDB one one can effectively

block the the the request.

All right.

So I'm going to use this the same long polling example that we did.

And what we're going to do is go to the browser and submit a bunch of submit a job.

Let's go ahead and submit a job in the browser.

And from that job, what we're going to do is we're going to continue checking the status.

So we're going to send multiple connections to the to the server with this, right?

So go that we've got a job.

What we're going to do is we're going to make a query here and then the job ID, I'm going to check

for this job.

And because it's long polling, remember, the request will be used, right.

And that connection will be occupied.

So we're going to do is send a bunch of requests.

And of course, we're not going to get a response because this is long polling.

I'm going to send a bunch of them right here and.

Not as now.

If I try to submit, I'm blocked.

I can't even submit jobs because now the connection pool is actually filled.

All of these are busy and now you cannot send any more requests until some of these are actually done.

So if you continue watching this for a minute, you can see that these are my submitted.

Some of them are succeeded, some of them are pending.

Remember, the submit job is an immediate thing.

I should immediately get a response.

But now we're blocked.

Nobody's ever actually unblock the client side.

No one else can send.

And immediately look at this.

The moment we get responses here, we unblock the other requests and now we transmit them to the server.

And now you can see the waterfall for requests to see that the blocking that happens.

And these are all connections that has been effectively stalled, right?

There's been stalled for 1.2 minutes and stalling happen usually in the client side.

And we didn't even attempt to establish a new connection because we couldn't we didn't we couldn't have

we didn't have enough resources.

And now we can see that one, two, three, four, five, six.

This is the green line is the six connections, and that's it.

You cannot effectively establish more connections in the the browser.

Why?

Because the protocol is what it should be.

One one.

The client by default submits six connection and even the six connections really controlled by by Chrome.

Sometimes it just it forces you to wait.

It doesn't establish another one unless it absolutely needs to.

So you can get into this.

And it's very clear from here.

Right.

And the connections, you can see that if I expand look at the connection IDs these.

Or if you count them, they're going to be six, right?

5353 All of them are the same connection.

Same connection.

One connection.

11 is another connection.

So we have 271 364.

Well.

Four 6553.

It's the same one, right.

49.

I suppose 49 is the new one.

Right.

47.

We didn't see 47 before.

Right.

92.

And you might see the same corrections.

It doesn't have to be six because some connection might have been closed and reopen again.

That's why we reusability is really important here for Chrome to not exceed that six the hard number

of six connection.

And again this is a long standing issues and this is all pair domain.

Of course, if you have multiple domains, you can send open multiple connections.

All right.

That ends the multiplexing and multiplexing lecture see on the next one.


