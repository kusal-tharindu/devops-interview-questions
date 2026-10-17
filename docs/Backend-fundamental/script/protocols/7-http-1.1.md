All right, HTP one one.

A simple pro quo that last decades actually still being used in this lecture.

We're going to talk about HDB one one and HDB one.

Oh, we get a hint about this TV two.

We're going to hint about it should be three because those deserve their own full lecture, talking

about them in details.

But for now to talk about one zero and one one, why do we have it?

Why is it so beautiful and simple and still being used?

A lot of people even don't refuses to upgrade.

They refuse to upgrade to HD too, because TV one works for them and it should be too.

Technically still has some trouble.

Right.

Some limitations that your architecture might not work with.

Other other other architecture might work, but simply too has its own limitations that if you can't

plug those limitations, you might get into a problem.

Let's jump into it.

Client server Architecture.

Today, if we have a web browser, a Python, a JavaScript app, or any app that makes a request that's

considered an HDTV client, and we have an HD observer, which can be the iOS, Apache, Tomcat, Apache,

you know, SDB, lightly know, Jazz, Python, Tornado, and.

We have many, many, many observers.

So we can start with the simplicity of the HDTV request.

How does this look like and should it be a request composed of one, two, three, four?

Five parts.

No.

There's also going to be a method.

This is get.

Put delete post.

Head?

No, but.

In the Web.

You might you might notice that you'll almost never use anything other than get them post and.

The port was designed for to be like, Hey, I'm going to update something, but people use post for

that and.

And git is for reading things effectively and then the path of the URL.

Let's say you want to visit w w w to google.com slash I don't know about right.

Or Jose nutso dot com slash about better my website.

Right.

So the path will be slash about.

Because the domain stays the same here.

The whole path is anything after the first slash.

That's the path, right?

If you don't put anything I say, I want to go.

W w w w Hussein also dotcom.

The path is just a slash.

Slash this way.

This way.

And the protocol.

The third piece is the protocol is av1110 should be on oh should be three what it is.

Right.

And then the second piece is a collection of key value pairs representing the header content type is

application slash days and content length is 700 bytes.

Cookie is equal blah.

Authority is blah.

Host Is WWE hosting NOLA.com?

The host haters is one of the most important ones by the way is now required.

He used not to be required and the body and the body is basically the body of the message.

There is to be request.

And this is basically empty when it's a get request because get request don't have body they have basically

you can put query parameters.

It's by the way, query parameters are in the path, right.

So you do a slash question mark, blah blah blah and percent blah blah blah, ampersand, blah, blah,

blah.

These are the query parameters and that's how you pass the path to get the query parameters.

It's in the URL effectively anything.

The URL is literally the whole entire path.

And guess what?

It has a limit.

The URL has a limit and each observer defines this limit is differently.

Some server says, Hey, it's 2000 bytes.

Some server says it's 2000 characters, some say it's 8000 character.

And yeah, so be careful with Git.

If you have a long get request with a big URL, it might fail if the server doesn't support it.

And the body of course is going to be null.

But post request for example will have body and the body doesn't technically have a limit.

The header we can content length.

I don't know how many bits there.

Maybe it's a 64 bit integer.

I think it depends with the server side implementation, but that will determine effectively the body.

Right.

Here's an example from Colonel.

I'm going to do a curved dash v http colon slash slash Jose News.com slash about when I do that.

Here's the request.

The request will get slash about.

That's the path that protocol.

And then we're going to add the headers host colon space Jose and also the com because that's that's

the domain right that's the always the host always becomes the domain.

You might say y.

Y y.

Why do we repeat it?

Because technically, the IP address is enough to identify the host.

Actually, it's not.

It's actually not a good idea.

Because.

Because one IP address can host a 100 website.

This was not the case back in the nineties.

Right.

The longest is one.

Whoops.

If you have one website, the DNS will resolve to an IP and you get one website that said you don't

get that on a website.

But then people said, wait a minute, I can host multiple websites on the same IP address.

So I want to say I want I'm not going to buy ten IP address just to host ten website.

So what the people did is like if you actually have ten domains, right, that all point to the same

IP address, you can add like let's say Jose Nassau one and Jose and also to Jose and also three dot

com.

All of them point to the same IP address.

But if you actually specify the host header, then also one dotcom, the IP address at the TCP layer

which is below it will be the same.

But because we're sending different hosts, the app, the backend knows that oh, you're going to host

and also one dot com.

Oh, that's this folder.

Jose Nassau two dotcom.

Oh, that's this folder.

Although you're all connected to the same machine effectively and that's the trick behind a multi multi

home DDoS hosting effectively.

Let's move on.

This is obviously the user agent is coral and yet and the user agent is effectively curl.

These are agents basically whoever the client that have made this request effectively it's a browser

is going to show you Mozilla whatever you know Chrome and it's a long string for backward compatibility.

They put everything and then accept and it is all the htp response looks like.

No, when you respond, it's the other way around.

You put the protocol that responds with you, put the code right.

Is it 200 OC?

Is it three or four or not modified.

Is it four or four error?

Is it 500 error?

You put the code here and then it's TV one one.

You put also the code text redundantly if you think about it.

Right.

Because we know that 200 is always going to be okay.

Right.

Yet we used to put we used to put always describe it in the text.

Right.

And it should be too.

This was removed.

And actually I have a bug with the chrome or the Chrome team.

I think I submitted like three years ago, where if you hover on in Chrome over the code, it will not

show you if it's SDB two, but it will show you visited SDB one one.

If you are like code 200, you hover over your two hundreds.

Okay?

Or three or four is not modified, right?

Yeah.

So if you hover over the code, the status code in the response and the dev tools, you will, you will

only see the description of the code if it's HDP one one if it's a SDB two or later, you will not see

it.

And the reason that they were relying on the response to tell them what this code is, because the XB

one actually had the code is to be two.

They removed it because it's duplicate.

Like why, why would I blow it?

The response for no reason.

So should be two and three remove them and as a result it broke devtools because they were relying on

that.

So if you hover over that it shows you nothing effectively.

So they were thinking about how to solve it.

They want to build like a dictionary of all the codes and ship it with chrome.

But apparently nobody solved my my bug yet.

So that's another thing, right?

So headers is the next thing.

Hey there is the headers, the content type is this blah blah blah.

And the body, the actual response goes into the body.

The content length is the header.

Here is the here is the length of the body, the content length of the body.

The body is actually defined by the content length header.

So let's take an example and I can disappear here and I don't need me.

Here's the response.

It looks like in this case this is an STV too, right?

So IMDB to exactly look at this 301 and there is no description.

If I do allege to be one one request, you will see the actual description.

Right?

You know what?

You might not believe me.

Let me actually do it right now.

Let's actually do it.

Why not?

Vital col de cv http engine x dot org.

I think this is atv11.

Right.

If I go to the response.

British TV one is in Gen-X.

DB one one.

There you go.

You see it?

So the protocol version, the code, and then what?

Okay.

Which is what this code describes to.

Let's go back to the slides.

So.

How about that live demo?

The location.

Location is basically a redirect header, so it's.

Hey, go and redirect to this.

And instead, when you go to Jose and also Dotcom, go to Slash about the date, the content type which

server go I'm hosted in Google so it's a GSIS length, content length and then accessible protection

some other headers and then the actual content with which is the HTML page, Right.

That's all it looks like.

All right.

So let's see how it should be.

Looks like so this is how it should be.

Will look like you would you would first open a connection because HDB is built on top of TCP.

It will which we talked about.

We talked about TCP and all the the details about TCP initiative.

You going to open a TCP connection because HTTP is built on top of DCB, you can open a USB connection,

so do the three way handshake.

Right after that you're going to send a request and then you're going to get back a response headers

and Dexter's HTML, all the details, right?

And then you close the connection and this TPS.

And what do we add to that?

If we want to secure the American connection, we first do a TLS handshake first, and after the TCP,

we do a TLS handshake and we're going to do in a separate section.

I'm going to talk in details about what each step is here.

Right.

So in this in the TLS handshake, both the client and the server will agree on the symmetric key.

And we use symmetric encryption because it's faster than asymmetric encryption, and especially for

large content like what we're about to send.

Right.

So once we agree on this, key symmetric key has to be the same key, same key encryption, same key

decrypts.

But if it's the same key, the key exchange is very critical.

How do you actually exchange the key?

Right.

Without actually sending a plaintext in the network?

Because anyone can sniff it.

Right.

So what you do is effectively you exchange it using something called Diffie Hellman or RSA, Right.

Or and then after that you use it to encrypt the get request and then get back the sort of encrypted

will decrypt the request using the same key and then understand it, process it, and then respond back

before the response encrypts the content and then send it back and close the connection.

Here's how it looks like.

And it should be one oh, the first first version.

So those are just an overview of how it looks like and it's going to be one oh, the first version every

the first time you want to send a request, you open a connection, you open a brand new connection,

and then you send your get request and then the server processes it, and then the moment you get a

response, guess what?

You close the connection.

That was the contract and went on because TB was stateless, says, Hey, I don't care about the connection,

don't leave it open.

That was the days in the 1990s, right, where actually keeping a TCP connection alive actually consumes

a lot of CPU and not severe memory effectively in the file descriptor keeping it alive.

Was not a good idea because we had limited time these days.

Who cares?

Keep it open.

Why?

Right.

But the problem here is that's the problem.

We closing the connection every time just to save our memory.

But if I want to send another request open.

Another one send.

So get the next email.

Then you to send the image one and then close the connection and then open another one to send the image

to and then send the thesis and then send the other one.

So you are opening and closing.

Opening and closing.

And that is it really slows things down.

Plus the act of you want to save memory by closing connection.

If your HTML has a lot of resources that need to be downloaded, you just first of all, you thrash

the server with all these connection requests.

Plus second thing is, is you added extra latency because the setup cost, as we saw with the TCP lecture,

is really expensive, right, with every time.

So you don't have to do it initially if you want to add new connections with every request as we talked

about.

So it's that slow effectively and buffering.

The concept of buffering doesn't exist.

This transfer encoding which we use for effectively server sent event didn't exist.

You have to send the entire response.

You cannot chunk the response into smaller chunks.

Nope, you cannot do that.

You have to specify a content length and then that content must be all shipped.

And once you are done, you write the response, right?

But transfer encoding effectively, you can chunk the response at your leisure so that you can send

all any kind of a response that you don't know the length to technically.

So you can do it this way.

Transfer encoding chunked.

If this hitter has said you can do it this way, but one O didn't have this feature so you cannot do

buffering, cannot do server sent event, you cannot do a long bowling, all this stuff, you cannot

do any of this stuff.

And because the host header was optional, right, you can even do multi homed website if you have like

seven DNS entries all point to the same IP address and you want to serve different websites for each

website effectively for each domain.

You couldn't do this in one.

No.

Right.

Because the client never set the host header.

It just said, Hey, I'm just connecting to this IP address.

Of course that's enough.

One IP address is one website, which we discovered that this is not the case anymore.

Look at NetFlow net.

If I for example, all our upside net of I pointed the same IP address.

Probably right.

But but the fact that we send blah blah blah dot notify dot com.

Right.

That is enough for the server to know which website you're actually requesting.

That's when, when one was invented we said, okay, here's what we're going to do.

We're going to actually.

Make sure that keep alive is an option here, one who I believe had keep alive, but it wasn't enforced

right here.

When you when you send it open a connection, you get a request, keep it alive.

You tell the server, hey, keep this connection alive because I'm going to use it to send many, many,

many requests.

Right.

So you send a request, you get the index email, same connection.

Don't re-establish it, don't close it, Send another image, get a response, Send the other image.

Right.

Hey, give me give me another image.

Give me this results.

Give me this CSS, give me this JavaScript.

All of them in the same JavaScript, JavaScript, all of them are the same TCP connection.

That's one one for you.

So when one persisted, connection's the beauty of having a connection open because the cost is just

too high for us and it should be one one because of this connection.

Now it has lower latency because we don't have to do this dance with the server to establish a connection

with every time we send one to send a request and it has low CPU usage because guess what?

The only thing you need to do is just read the stream and find out the the start of the request, which

is we show how we we know how the request end right starts.

It is a get slash protocol if it looks for this and then at the end is the where the content length

is x, you pause until you find the content and that's the end.

All right.

The problem with that is where I think we can I can show myself again, I can show you some example.

The problem with this, you guys is I don't know if you heard about something called HTTP smuggling.

It should be a smuggling happen when when the server gets confused at where is the end and where is

the start of the request.

And hackers use that technique by sometimes including to content length, right to smuggle, sometimes

including to content length or sometimes including content length and transfer encoding.

And the server says, okay, which one should I use?

And the protocol did not define that, of course.

And if you don't define something in the spec people is going to make it up, right?

So as a result you might have engine X, right?

And you might have the back end has no JS observer and the engine X will say, okay, you give me to

content length, I'm going to take the first one, right?

And it will assume anything after that is the actual content and will pass the request.

A Right, but the actual no will get everything, but then it will get the second content, let's say.

Oh, actually the length actually 100 is not 200.

So you can get different requests based on how the parsing happened.

You see how complex this thing is and this is can lead to HDB smuggling where you can have.

The an admin request for example, to look to load the admin page, snuck behind the proxy so that energy

is actually can.

Execute it for you.

You.

That's why you smuggle it right behind there.

That's just another kind of tidbit for you.

Streaming with Chuck and transfer, of course, this is a new feature and one one has been designed

there.

And of course we have pipeline ing, which is disabled by default.

You know what?

Let's actually talk about pipeline.

I forgot.

I think I forgot to talk about Pipeline.

This is very important.

Let's talk about Pipeline.

Right.

So you see the problem with this, right?

We have a request and we wait and then we request and then we wait.

And then we request and we wait.

Right?

So we have one connection and we only can send one request at a time.

And this is if you think about it, the client is not doing anything meanwhile.

Right.

It's just waiting.

So what if we pipeline the request?

This is a concept taken from the CPU, if you think about it.

Right, the CPU actually I have this concept where this is the CPU takes goes through a lot of phases

where it says, okay, I'm now switching them from memory, I'm now executing this instruction now going

to the next phase, right.

So sometimes when the CPU is not is like fetching something from the RAM, you can actually execute

something meanwhile.

Right.

Think of it like a few.

The best example for this is when you're washing your clothes and you want to dry them and fold them.

Right?

That's a perfect example for Pipeline where let's say I want to wash one load of, you know, cloth

and then once it's done, I'm going to take that load and then put it in the dryer and wait.

And then once the dryer is done, I'm going to go and fold them.

Right.

So meanwhile, the dryer and the washer is not doing anything right.

What you can do is effectively put some another load in the washer while the dryer is drying.

And then you can you can fold the first load.

Right.

So that's how you can take advantage of resources.

Very similar here.

CPU is very similar.

That's taken from the CPU actually where you can execute other processes.

Meanwhile, while we're reading from other from another one, we're reading from memory, for example.

Right.

Because reading from memory is not really is not really doing anything.

We're just waiting.

Right.

Reading for a memory is slow compared to the CPU, by the way.

That's why.

So now pipeline is to be one.

One comes to that topic again, full circle.

The client actually can send all the three requests together.

Right.

And the server, whatever.

The server can just process 1 to 3 at the same time and then respond.

Okay, This is the first request.

It is the second response.

That is the third response.

So all of them, you can do it this way.

The problem with this is it's very limiting.

And why?

Because what happened if let's say XHTML, the HTML is so large, So it took time, but the image is

tiny.

Does the server respond with the image first?

No, because if it does, then the client will think that the first response is the first request.

That's what That's the client.

How it thinks about.

Right.

So if you respond with the image, the image will be rendered as the HTML and things will break.

So what the server does in case of file planning, it actually, even if the image two, one or two

was finished before the HTML, it will actually block.

It will actually wait until the HTML is loaded and then it will respond with the HTML.

Kind of defeating the purpose.

Is it right if you're blocked, if you are blocking and waiting on the server side just because you

want to maintain order, that kind of defeats the whole purpose of the of the pipeline.

Plus, not only that.

You're this order is kind of a dead on arrival.

Because what if there is a proxy right in the middle here?

How do you guarantee that the proxy in the middle will guarantee the order?

You have no clue.

The idea of having to maintain the order broke the Internet when this was implemented.

Right.

So nobody actually uses a HDP on one pipeline in HTTP.

It's disabled by default.

It's just because it's a messy you cannot guarantee that it was going to work correctly, especially

in proxies, you know, on the server.

Have to understand this, you know, and plus the concept of blocking is just it's not it's not cool,

right?

Unless you have to somehow solve this problem at the protocol level where you mark the request with

a specific identified, I say, hey, whenever you get a response, respond, but tell me that this

is actually the respond, right?

Tell me that what do you just reply to me is actually request number three.

And this doesn't exist in DCP.

Of course you have to build it.

You can build it, you can build anything.

The application level, you can build this yourself, you can send a request ID and then respond.

You can build this.

And then if you do that, kudos, you can, of course do it.

DNS works.

The similar DNS actually has a query ID, so yeah, pipeline.

So we said pipeline is disabled by default because it's not reliable.

And we talked about proxy thing and multi homed website where one IP can host literally thousands of

offsite really if you can if you want to do that that's that's not hard.

So let's talk quickly about HTTP two for a minute here and what problem does this solve?

Right.

This was invented first by Google.

It's called Speedy, and it used to be called speedy.

And the goal here was it has it has compression in both the headers and the body.

I know we didn't talk about compression much because it goes into the width and I don't know how how

much detail should I go with this with the score?

So we'll keep it, we'll keep it light, we'll keep it the light and let me know.

Guys, what do you think?

And we'll increase the detail level as necessary.

But yeah, compression.

Now you supported on both the header and the body and HTTP one one header compression was disabled because

of a of an attack called crime.

Someone was able to extract cookie information just because of the way we compress headers.

And that was really bad, right?

So to solve this, right, of course.

And we had the idea of multiplexing with STV two where we have one connection and all these requests

that we talked about will get uniquely tagged with a stream ID.

So now we know that if we receive something on this stream, we know that this is the we only send one

request on the stream.

We're not going to send another one.

Right?

So you're good.

So with multiplexing you can do technically pipeline, you can do multiplexing.

It's not really pipe lining, but you can send multiple requests at the same time on the same connection.

And there's this thing that's called server push, of course is is dead.

They stopped supporting it because it didn't pan out.

But I thought, I'll add it secure by default.

HDP two is secure by default.

And the reason is because something called protocol ossification.

We talk about protocols, you guys.

Right.

And the protocol has a language, right?

Has a set of rules.

And the problem the problem with these rules is once you have devices that implement these rules, it's

really hard to change those rules.

And so you have a bunch of routers in the middle, right?

That actually passes a STB request.

If it's unsecure, that if it's insecure, then you will say, okay, this is how STB should look like

and the wire should we should have get and then code and then path and then slash and then port and

then this and then headers and then after the header is the buddy and then there are routers in the

middle boxes right here.

Not now actually does that in the internet and, and you'll be lucky.

To hate it or not.

And because of those rules, those routers, they were built.

And they were just forgotten.

And this whatever ninety's right.

Now what happened?

If I want to change the protocol, I'm going to keep the compatibility.

By the end, the writing protocol is going to change.

So now OC says, Hey, I should be do a completely different binary protocol.

We talked about it, right?

It's completely different.

And in the wire binary, so different.

We're going to talk about it in a bit to lecture, but it's completely different.

And if you do port 80, right, which routers and these middle boxes know that Port 80 is HDP and this

is HDTV, it's CDB one one, Right.

That's the only thing they know the moment you start sending STB to.

Stuff.

Those rotters were rejected.

That's why HD two didn't work on an unsecured network.

You had to secure it so nobody could actually pass it because if you secure it, nobody can see it,

right?

So that's why STB turns out secure.

But if it's kind of the double edge, it's actually a good thing.

Turns out to be a good thing.

So we get security by default.

Right.

And of course, protocol negotiation is done through TLS, something called the NPN and the ALP, an

application layer protocol negotiation.

And the goal here is like, if I want to connect, how do I tell the server that, hey, by the way,

before I even send an initiative request, how do I tell the server that, hey, by the way, I supported

STB to.

If you supported let's talk that language.

The negotiation is done through during TLS, through the TLS extension called ALP HTTP over.

Quick, let's go quickly over this.

Get it.

Did you see what I did there?

Replaces TCP with quick.

Right.

So UDP with congestion control.

That's basically what it does.

You see the problem with HTTP two is effectively the the TCP head of line blocking.

I'm going to talk about it in details, but that's the problem.

The problem is TCP when it comes to HTTP two, right.

It TCP just does too much.

The problem is that because it does too much, you can't innovate at the application layer.

So what what what the quick protocol did is they effectively took all the features of the STB.

They pushed it down a layer four.

They built a new transport system with the idea of the streams.

But each stream now has the concept of congestion control.

Each stream is is aware of its stuff.

We're going to talk about it in detail.

It has all the activity for a feature.

It doesn't have a hurdle of line blocking.

And let's summarize.

So we talked about the HTTP anatomy.

We talked about one over TCP one, one over TCP DB, two over TCP, and we talked about very quickly

about HTTP three, which is should be over quick, effectively.

Hope you enjoy this lecture, guys.

I'm going to see you in the next one.

You guys stay.