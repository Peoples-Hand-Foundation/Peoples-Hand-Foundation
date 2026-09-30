import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
BrowserRouter,
Routes,
Route,
Link,
useParams,
useLocation
} from 'react-router-dom';

import {
Heart,
Menu,
X,
ArrowRight,
Users,
Utensils,
GraduationCap,
Stethoscope,
HandHeart,
ShieldCheck,
CalendarDays,
MapPin,
Clock,
Play,
Image as ImageIcon,
Pencil,
Trash2,
Plus,
UserRound,
Mail,
MessageCircle
} from 'lucide-react';

import './styles.css';


/* =========================================================
SCROLL TO TOP ON PAGE CHANGE
========================================================= */

function ScrollToTop() {

const { pathname } = useLocation();

useEffect(() => {

if ('scrollRestoration' in window.history) {
window.history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

requestAnimationFrame(() => {
window.scrollTo(0, 0);
});

}, [pathname]);

return null;
}


/* =========================================================
API
========================================================= */

const API =
import.meta.env.VITE_API_URL ||
'http://localhost:5000/api';


/* =========================================================
HELPERS
========================================================= */

function slugify(value) {
return String(value || '')
.toLowerCase()
.trim()
.replace(/\s+/g, '-')
.replace(/[^a-z0-9-]/g, '');
}


function ActivityIcon({ name }) {

if (name === 'Utensils') {
return <Utensils />;
}

if (name === 'GraduationCap') {
return <GraduationCap />;
}

if (name === 'Stethoscope') {
return <Stethoscope />;
}

if (name === 'Heart') {
return <Heart />;
}

return <HandHeart />;
}


/* =========================================================
API HELPER
========================================================= */

async function api(path, opts = {}) {

try {

const response = await fetch(
API + path,
{
headers: {
'Content-Type': 'application/json',
...(opts.headers || {})
},
...opts
}
);


if (!response.ok) {
throw new Error(
`API request failed: ${response.status}`
);
}


return await response.json();

} catch (error) {

console.error(
'API Error:',
error
);

return null;
}
}


function adminHeaders(extra = {}) {

const token =
localStorage.getItem(
'adminToken'
);

return {
...extra,
...(token
? { Authorization: `Bearer ${token}` }
: {})
};
}


/* =========================================================
FALLBACK DATA
========================================================= */

const fallback = {

impact: {
people_supported: 50,
meals_distributed: 200,
students_supported: 20,
medical_camps: 1,
volunteers: 12,
social_activities: 9
},


activities: [
{
title: 'Food Distribution',
icon: 'Utensils',
description:
'Distribute nutritious meals and food items to people and communities who need support.'
},

{
title: 'Clothing Distribution',
icon: 'HandHeart',
description:
'Provide clothes and essential clothing items to people and families in need.'
},

{
title: 'Education Support',
icon: 'GraduationCap',
description:
'Support students with books, stationery, school supplies and educational resources.'
},

{
title: 'Healthcare Support',
icon: 'Stethoscope',
description:
'Support communities through healthcare initiatives and medical camps.'
},

{
title: 'Medical Camps',
icon: 'Stethoscope',
description:
'Organize checkups, healthcare awareness and basic medical support.'
},

{
title: 'Essential Items',
icon: 'HandHeart',
description:
'Distribute essential household and daily-use items to people who need support.'
}
],


events: [],

team: [],

gallery: []

};


/* =========================================================
HEADER
========================================================= */

function Header() {

const [open, setOpen] =
useState(false);


const nav = [
'About',
'Activities',
'Impact',
'Events',
'Donate',
'Volunteer',
'Team',
'Gallery',
'Contact'
];


return (

<header>

<div className="nav">

<Link
className="brand"
to="/"
>

<span className="logo">
<Heart />
</span>


<span>

People’s Hand Foundation

<small>
One Day – Many Smiles ❤️
</small>

</span>

</Link>


<button
className="menu"
onClick={() =>
setOpen(!open)
}
>
{open ? <X /> : <Menu />}
</button>


<nav
className={
open
? 'show'
: ''
}
>

{nav.map((item) => (

<Link
key={item}
to={
'/' +
item.toLowerCase()
}
onClick={() =>
setOpen(false)
}
>
{item}
</Link>

))}


<Link
className="btn btn-small"
to="/donate"
>
Donate Now
</Link>

</nav>

</div>

</header>
);
}


/* =========================================================
FOOTER
========================================================= */

function Footer() {

return (

<footer>

<div className="footer-grid">

<div>

<div className="brand footer-brand">

<span className="logo">
<Heart />
</span>


<span>

People’s Hand Foundation

<small>
One Day – Many Smiles ❤️
</small>

</span>

</div>


<p>
Helping People • Supporting Communities • Creating Smiles
</p>

</div>


<div>

<h4>
Explore
</h4>

<Link to="/about">
About Us
</Link>

<Link to="/activities">
Activities
</Link>

<Link to="/impact">
Impact
</Link>

<Link to="/events">
Events
</Link>

<Link to="/team">
Our Team
</Link>

<Link to="/gallery">
Gallery
</Link>

</div>


<div>

<h4>
Get Involved
</h4>

<Link to="/donate">
Donate
</Link>

<Link to="/volunteer">
Volunteer
</Link>

<Link to="/contact">
Contact
</Link>

</div>


<div>

<h4>
Connect
</h4>

<a
href="https://www.instagram.com/peoples_hand_foundation/"
target="_blank"
rel="noreferrer"
>
Instagram
</a>

<Link to="/admin">
Admin Login
</Link>

</div>

</div>


<div className="copyright">

© 2026 People’s Hand Foundation.
All Rights Reserved.

</div>

</footer>
);
}


/* =========================================================
LAYOUT
========================================================= */

function Layout({ children }) {

return (
<>
<Header />
{children}
<Footer />
</>
);
}


/* =========================================================
PAGE HERO
========================================================= */

function PageHero({
title,
subtitle
}) {

return (

<section className="pagehero">

<p className="eyebrow">
PEOPLE’S HAND FOUNDATION
</p>


<h1>
{title}
</h1>


<p>
{subtitle}
</p>

</section>
);
}


/* =========================================================
IMPACT
========================================================= */

function Impact({
data = fallback.impact
}) {

const items = [

[
'People Supported',
data.people_supported
],

[
'Meals Distributed',
data.meals_distributed
],

[
'Students Supported',
data.students_supported
],

[
'Medical Camps',
data.medical_camps
],

[
'Volunteers',
data.volunteers
],

[
'Social Activities',
data.social_activities
]

];


return (

<section className="impact">

<div className="section-head">

<p className="eyebrow">
OUR IMPACT
</p>

<h2>
Every contribution creates a meaningful difference.
</h2>

</div>


<div className="stats">

{items.map(
([label, value]) => (

<div
className="stat"
key={label}
>

<strong>
{value}+
</strong>

<span>
{label}
</span>

</div>

)
)}

</div>

</section>
);
}


/* =========================================================
HOME
========================================================= */

function Home() {

const [impact, setImpact] =
useState(
fallback.impact
);


useEffect(() => {

api('/impact')
.then((data) => {

if (data) {
setImpact(data);
}

});

}, []);


return (

<Layout>

<main>

<section className="hero">

<div className="hero-copy">

<p className="eyebrow">
PEOPLE’S HAND FOUNDATION
</p>


<h1>

One Day –
<br />

<em>
Many Smiles
</em>

❤️

</h1>


<p>
Bringing individuals, volunteers, donors
and communities together to support people
in need through food, clothing, education,
healthcare and meaningful acts of kindness.
</p>


<div className="actions">

<Link
className="btn"
to="/donate"
>
Donate Now
<ArrowRight />
</Link>


<Link
className="btn ghost"
to="/volunteer"
>
Become a Volunteer
</Link>

</div>

</div>


<div className="hero-art">

<div className="sun"></div>


<div className="photo-placeholder">

Community
<br />
Care &amp; Kindness

</div>


<div className="floating">

<Heart />

Small acts. Big smiles.

</div>

</div>

</section>


<Impact
data={impact}
/>


<section className="about-preview">

<div className="image-card">
❤️
</div>


<div>

<p className="eyebrow">
ABOUT US
</p>


<h2>
Small contributions can create meaningful change.
</h2>


<p>
People’s Hand Foundation works to support
underprivileged and needy people through
community-based social activities. We believe
that even a small contribution can bring a
smile to someone's face.
</p>


<Link
className="text-link"
to="/about"
>
Learn more
<ArrowRight />
</Link>

</div>

</section>


<ActivitiesPreview />


<EventsPreview />


<section className="join">

<p className="eyebrow">
GET INVOLVED
</p>


<h2>
There are many ways to make a difference.
</h2>


<div className="join-grid">

<Link to="/donate">

<HandHeart />

<h3>
Support Our Mission
</h3>

<p>
Your contribution helps us reach more people.
</p>

</Link>


<Link to="/volunteer">

<Users />

<h3>
Join as a Volunteer
</h3>

<p>
Give your time, skills and kindness.
</p>

</Link>


<Link to="/gallery">

<Heart />

<h3>
See Our Journey
</h3>

<p>
Explore real activities, events and celebrations.
</p>

</Link>

</div>

</section>

</main>

</Layout>
);
}


/* =========================================================
ACTIVITIES PREVIEW
========================================================= */

function ActivitiesPreview() {

const [activities, setActivities] =
useState(
fallback.activities
);


useEffect(() => {

api('/activities')
.then((data) => {

if (Array.isArray(data)) {
setActivities(data);
}

});

}, []);


return (

<section className="section">

<div className="container">

<div className="section-heading">

<span className="eyebrow">
What We Do
</span>

<h2>
Our Activities
</h2>

<p>
We work together to support people and communities
through meaningful social activities.
</p>

</div>


<div className="cards">

{activities
.slice(0, 6)
.map((activity) => (

<div
className="card"
key={
activity.id ||
activity.title
}
>

<div className="icon">

<ActivityIcon
name={
activity.icon
}
/>

</div>


<h3>
{activity.title}
</h3>


<p>
{activity.description}
</p>


<Link
className="text-link"
to={
`/activities/${
activity.id ||
slugify(
activity.title
)
}`
}
>
View Activity
<ArrowRight size={16} />
</Link>

</div>

))}

</div>


<div className="center">

<Link
className="btn"
to="/activities"
>
View All Activities
</Link>

</div>

</div>

</section>
);
}


/* =========================================================
EVENTS PREVIEW
========================================================= */

function EventsPreview() {

const [events, setEvents] =
useState([]);


useEffect(() => {

api('/events')
.then((data) => {

if (Array.isArray(data)) {
setEvents(data);
}

});

}, []);


if (!events.length) {
return null;
}


return (

<section className="section">

<div className="container">

<div className="section-heading">

<span className="eyebrow">
EVENTS
</span>

<h2>
Our Events
</h2>

<p>
See upcoming and recent community activities.
</p>

</div>


<div className="cards">

{events
.slice(0, 3)
.map((event) => (

<div
className="card"
key={
event.id ||
event.title
}
>

<div className="icon">
<CalendarDays />
</div>


<h3>
{event.title}
</h3>


<p>
{event.description}
</p>


<p>
<CalendarDays size={16} />
{' '}
{event.date}
</p>


<Link
className="text-link"
to={
`/events/${
event.id ||
slugify(
event.title
)
}`
}
>
View Event
<ArrowRight />
</Link>

</div>

))}

</div>


<div className="center">

<Link
className="btn"
to="/events"
>
View All Events
</Link>

</div>

</div>

</section>
);
}


/* =========================================================
ABOUT
========================================================= */

function About() {

return (

<Layout>

<PageHero
title="About Us"
subtitle="A community built around compassion, participation and practical support."
/>


<section className="content two">

<div>

<p className="eyebrow">
WHO WE ARE
</p>


<h2>
Helping people. Supporting communities.
Creating smiles.
</h2>


<p>
People’s Hand Foundation works to support
underprivileged and needy people through
community-based social activities.
</p>


<p>
We believe that even a small contribution can
bring a smile to someone's face. Our activities
focus on helping people with basic needs and
celebrating important occasions in a meaningful
way by sharing happiness with those who need support.
</p>

</div>


<div className="quote">

“One day can change a moment. Many people
choosing kindness can change a community.”

<span>
— People’s Hand Foundation
</span>

</div>

</section>


<section className="values">

<Value
title="Our Mission"
text="Support people in need, provide basic necessities, encourage community participation and expand access to education and healthcare initiatives."
/>


<Value
title="Our Vision"
text="A society where people come together to support one another and ensure that no one is left without basic support during difficult times."
/>


<Value
title="Our Values"
text="Compassion, dignity, transparency, community participation, respect and responsible service."
/>

</section>

</Layout>
);
}


/* =========================================================
VALUE
========================================================= */

function Value({
title,
text
}) {

return (

<div className="value">

<Heart />

<h3>
{title}
</h3>

<p>
{text}
</p>

</div>
);
}


/* =========================================================
ACTIVITIES
========================================================= */

function Activities() {

const [activities, setActivities] =
useState(
fallback.activities
);

const [loading, setLoading] =
useState(true);


useEffect(() => {

api('/activities')
.then((data) => {

if (Array.isArray(data)) {
setActivities(data);
}

})
.finally(() => {
setLoading(false);
});

}, []);


return (

<Layout>

<PageHero
title="Our Social Activities"
subtitle="Turning community participation into practical support."
/>


<section className="content">

{loading ? (

<p>
Loading activities...
</p>

) : (

<div className="cards">

{activities.map(
(activity) => (

<div
className="card large"
key={
activity.id ||
activity.title
}
>

<div className="icon">

<ActivityIcon
name={
activity.icon
}
/>

</div>


<h3>
{activity.title}
</h3>


<p>
{activity.description}
</p>


<Link
className="text-link"
to={
`/activities/${
activity.id ||
slugify(
activity.title
)
}`
}
>
View Activity
<ArrowRight />
</Link>

</div>

)
)}

</div>

)}

</section>

</Layout>
);
}


/* =========================================================
ACTIVITY DETAILS
========================================================= */

function ActivityDetails() {

const { id } =
useParams();


const [activities, setActivities] =
useState(
fallback.activities
);


const [loading, setLoading] =
useState(true);


useEffect(() => {

api('/activities')
.then((data) => {

if (Array.isArray(data)) {
setActivities(data);
}

})
.finally(() => {
setLoading(false);
});

}, []);


const activity =
activities.find((item) => {

const slug =
slugify(
item.title
);


return (
slug === id ||
String(item.id) ===
String(id)
);

});


if (loading) {

return (

<Layout>

<PageHero
title="Loading Activity..."
subtitle="Please wait while we load the activity details."
/>

</Layout>
);
}


if (!activity) {

return (

<Layout>

<PageHero
title="Activity Not Found"
subtitle="The requested activity could not be found."
/>


<section className="content">

<Link
className="btn"
to="/activities"
>
Back to Activities
<ArrowRight />
</Link>

</section>

</Layout>
);
}


return (

<Layout>

<PageHero
title={activity.title}
subtitle={activity.description}
/>


<section className="content activity-detail">

<div className="activity-detail-icon">

<ActivityIcon
name={
activity.icon
}
/>

</div>


<div>

<p className="eyebrow">
OUR ACTIVITY
</p>


<h2>
{activity.title}
</h2>


<p>
{activity.description}
</p>


<p>
People’s Hand Foundation works with volunteers,
donors and communities to organize meaningful
support through this activity.
</p>


<div className="activity-actions">

<Link
className="btn"
to="/volunteer"
>
Become a Volunteer
<Users />
</Link>


<Link
className="btn ghost"
to="/donate"
>
Support This Activity
<Heart />
</Link>

</div>


<Link
className="text-link"
to="/activities"
>
<ArrowRight />
Back to All Activities
</Link>

</div>

</section>

</Layout>
);
}


/* =========================================================
IMPACT PAGE
========================================================= */

function ImpactPage() {

const [impact, setImpact] =
useState(
fallback.impact
);


useEffect(() => {

api('/impact')
.then((data) => {

if (data) {
setImpact(data);
}

});

}, []);


return (

<Layout>

<PageHero
title="Our Impact"
subtitle="Every act of kindness creates a ripple of change."
/>


<Impact
data={impact}
/>


<section className="content">

<div className="impact-note">

<ShieldCheck />

<div>

<h2>
Real activity numbers, regularly updated
</h2>


<p>
Our impact figures are managed through the
foundation's admin dashboard so the public
website can reflect the latest available
activity numbers.
</p>

</div>

</div>

</section>

</Layout>
);
}


/* =========================================================
EVENTS PAGE
========================================================= */

function Events() {

const [events, setEvents] =
useState([]);


const [loading, setLoading] =
useState(true);


useEffect(() => {

api('/events')
.then((data) => {

if (Array.isArray(data)) {
setEvents(data);
}

})
.finally(() => {

setLoading(false);

});

}, []);


return (

<Layout>

<PageHero
title="Events"
subtitle="Upcoming, ongoing and completed community events."
/>


<section className="content">

{loading ? (

<p>
Loading events...
</p>

) : events.length === 0 ? (

<div className="empty-state">

<CalendarDays />

<h3>
No events available yet.
</h3>

<p>
Events added from the admin dashboard
will appear here.
</p>

</div>

) : (

<div className="cards">

{events.map(
(event) => (

<div
className="card large"
key={
event.id ||
event.title
}
>

<div className="icon">
<CalendarDays />
</div>


<h3>
{event.title}
</h3>


<p>
{event.description}
</p>


<p>
<CalendarDays size={16} />
{' '}
{event.date}
</p>


{event.time && (

<p>
<Clock size={16} />
{' '}
{event.time}
</p>

)}


{event.location && (

<p>
<MapPin size={16} />
{' '}
{event.location}
</p>

)}


{event.status && (

<p>
<strong>
Status:
</strong>{' '}
{event.status}
</p>

)}


<Link
className="text-link"
to={
`/events/${
event.id ||
slugify(
event.title
)
}`
}
>
View Event
<ArrowRight />
</Link>

</div>

)
)}

</div>

)}

</section>

</Layout>
);
}


/* =========================================================
EVENT DETAILS
========================================================= */

function EventDetails() {

const { id } =
useParams();


const [events, setEvents] =
useState([]);


const [loading, setLoading] =
useState(true);


useEffect(() => {

api('/events')
.then((data) => {

if (Array.isArray(data)) {
setEvents(data);
}

})
.finally(() => {
setLoading(false);
});

}, []);


const event =
events.find((item) => {

return (
String(item.id) ===
String(id) ||
slugify(item.title) === id
);

});


if (loading) {

return (

<Layout>

<PageHero
title="Loading Event..."
subtitle="Please wait while we load the event."
/>

</Layout>
);
}


if (!event) {

return (

<Layout>

<PageHero
title="Event Not Found"
subtitle="The requested event could not be found."
/>


<section className="content">

<Link
className="btn"
to="/events"
>
Back to Events
<ArrowRight />
</Link>

</section>

</Layout>
);
}


return (

<Layout>

<PageHero
title={event.title}
subtitle={event.description}
/>


<section className="content">

<div className="event-detail">

<div className="event-detail-info">

<p>
<CalendarDays />
<strong>
Date:
</strong>
{' '}
{event.date}
</p>


{event.time && (

<p>
<Clock />
<strong>
Time:
</strong>
{' '}
{event.time}
</p>

)}


{event.location && (

<p>
<MapPin />
<strong>
Location:
</strong>
{' '}
{event.location}
</p>

)}


{event.beneficiaries && (

<p>
<Users />
<strong>
Beneficiaries:
</strong>
{' '}
{event.beneficiaries}
</p>

)}


{event.status && (

<p>
<strong>
Status:
</strong>
{' '}
{event.status}
</p>

)}

</div>


<div>

<p>
{event.description}
</p>


<Link
className="btn"
to="/volunteer"
>
Volunteer for an Event
<Users />
</Link>

</div>

</div>


<Link
className="text-link"
to="/events"
>
<ArrowRight />
Back to Events
</Link>

</section>

</Layout>
);
}


/* =========================================================
TEAM PAGE
========================================================= */

function Team() {

const [team, setTeam] =
useState([]);


const [loading, setLoading] =
useState(true);


useEffect(() => {

api('/team')
.then((data) => {

if (Array.isArray(data)) {
setTeam(data);
}

})
.finally(() => {

setLoading(false);

});

}, []);


return (

<Layout>

<PageHero
title="Our Founders & Core Team"
subtitle="People working together to plan, organize and execute social-service activities."
/>


<section className="content">

{loading ? (

<p>
Loading team...
</p>

) : team.length === 0 ? (

<div className="empty-state">

<UserRound />

<h3>
Team information will be added soon.
</h3>

</div>

) : (

<div className="cards team">

{team.map((member) => (

<div
className="team-card"
key={
member.id ||
member.name
}
>

{member.image ? (

<img
src={member.image}
alt={
member.name
}
/>

) : (

<div className="avatar">
PHF
</div>

)}


<h3>
{member.name}
</h3>


<p>
{member.role}
</p>


<p>
{member.description}
</p>

</div>

))}

</div>

)}

</section>

</Layout>
);
}


/* =========================================================
GALLERY
========================================================= */

function Gallery() {

const categories = [
'All',
'Photos',
'Videos',
'Events',
'Medical Camps',
'Food Distribution',
'Celebrations'
];


const [category, setCategory] =
useState('All');


const [gallery, setGallery] =
useState([]);


const [loading, setLoading] =
useState(true);


useEffect(() => {

api('/gallery')
.then((data) => {

if (Array.isArray(data)) {
setGallery(data);
}

})
.finally(() => {

setLoading(false);

});

}, []);


const filteredGallery =
category === 'All'
? gallery
: gallery.filter(
(item) =>
item.category ===
category
);


return (

<Layout>

<PageHero
title="Gallery"
subtitle="A glimpse into our activities, events, medical camps, food distributions and celebrations."
/>


<section className="content">

<div className="filters">

{categories.map(
(item) => (

<button
key={item}
className={
category === item
? 'active'
: ''
}
onClick={() =>
setCategory(item)
}
>
{item}
</button>

)
)}

</div>


{loading ? (

<p>
Loading gallery...
</p>

) : filteredGallery.length === 0 ? (

<div className="empty-state">

<ImageIcon />

<h3>
No gallery items available.
</h3>

<p>
Gallery items added from the
admin dashboard will appear here.
</p>

</div>

) : (

<div className="gallery">

{filteredGallery.map(
(item) => (

<div
className="gallery-item"
key={
item.id ||
item.title
}
>

{item.type === 'video' ? (

<div className="gallery-video">

<video
controls
src={item.media_url}
/>

<Play />

</div>

) : (

<img
src={item.media_url}
alt={
item.title
}
/>

)}


<span>
{item.title}
</span>


{item.location && (

<small>
{item.location}
</small>

)}

</div>

)
)}

</div>

)}

</section>

</Layout>
);
}


/* =========================================================
FORM PAGE
========================================================= */

function FormPage({
type
}) {

const config = {

volunteer: {

title:
'Join as a Volunteer',

intro:
'Your time, skills and kindness can help create meaningful change.',

fields: [
['name', 'Name'],
['mobile', 'Mobile Number'],
['email', 'Email'],
['location', 'Location'],
['area', 'Area of Interest'],
['days', 'Available Days'],
['message', 'Message']
]

},


celebrate: {

title:
'Celebrate With Someone in Need',

intro:
'Turn your special occasion into a meaningful day of giving.',

fields: [
['name', 'Full Name'],
['mobile', 'Mobile Number'],
['email', 'Email'],
['occasion', 'Occasion Type'],
['date', 'Occasion Date'],
['location', 'Preferred Location'],
['people', 'Number of People to Support'],
['support', 'Type of Support'],
['budget', 'Estimated Contribution / Budget'],
['message', 'Message']
]

},


contact: {

title:
'Contact Us',

intro:
'Have a question or want to work with us? Send us a message.',

fields: [
['name', 'Name'],
['mobile', 'Mobile Number'],
['email', 'Email'],
['subject', 'Subject'],
['message', 'Message']
]

}

}[type];


const [sent, setSent] =
useState(false);


async function submit(event) {

event.preventDefault();


const data =
Object.fromEntries(
new FormData(
event.target
)
);


const endpoint =
type === 'volunteer'
? 'volunteers'
: type === 'celebrate'
? 'celebrations'
: 'messages';


const result =
await api(
'/' + endpoint,
{
method: 'POST',
body:
JSON.stringify(data)
}
);


if (result !== null) {

setSent(true);

event.target.reset();

} else {

alert(
'Unable to submit right now. Please try again.'
);

}

}


if (type === 'contact') {

return (

<Layout>

<PageHero
title="Contact Us"
subtitle="For any questions or communication, please contact us directly."
/>

<section className="contact-section">

<div className="contact-intro">

<p className="eyebrow">GET IN TOUCH</p>

<h2>We’re Here to Help</h2>

<p>
For any questions, volunteering, donations, or other communication,
please reach out to us directly. We would be happy to hear from you.
</p>

</div>

<div className="contact-grid">

<a
className="contact-card email-card"
href="mailto:peopleshandfoundation@gmail.com"
>

<div className="contact-icon">
<Mail />
</div>

<div>
<span>Email Us</span>
<strong>peopleshandfoundation@gmail.com</strong>
<small>Click to send us an email</small>
</div>

<ArrowRight className="contact-arrow" />

</a>

<div className="contact-card whatsapp-card">

<div className="contact-icon">
<MessageCircle />
</div>

<div className="whatsapp-content">
<span>WhatsApp</span>
<strong>Chat with us directly</strong>
<small>Choose any number below to communicate with us</small>

<div className="whatsapp-numbers">

<a href="https://wa.me/919014278099" target="_blank" rel="noreferrer">
9014278099
</a>

<a href="https://wa.me/918328398816" target="_blank" rel="noreferrer">
8328398816
</a>

<a href="https://wa.me/918464942297" target="_blank" rel="noreferrer">
8464942297
</a>

</div>

</div>

</div>

</div>

<div className="contact-note">
<Heart />
<span>Helping People • Supporting Communities • Creating Smiles</span>
</div>

</section>

</Layout>

);

}


return (

<Layout>

<PageHero
title={config.title}
subtitle={config.intro}
/>


<section className="form-wrap">

<form
onSubmit={submit}
>

<div className="form-grid">

{config.fields.map(
([key, label]) => (

<label
key={key}
className={
key === 'message'
? 'full'
: ''
}
>

{label}


{key === 'message' ? (

<textarea
name={key}
rows="5"
required
/>

) : (

<input
name={key}
type={
key === 'email'
? 'email'
: key === 'date'
? 'date'
: 'text'
}
required
/>

)}

</label>

)
)}

</div>


<button
className="btn"
type="submit"
>
Submit
<ArrowRight />
</button>


{sent && (

<div className="success">

Thank you. Your submission has been received.
We will contact you soon. ❤️

</div>

)}

</form>

</section>

</Layout>
);
}


/* =========================================================
DONATE
========================================================= */

function Donate() {

const [sent, setSent] =
useState(false);


async function submit(event) {

event.preventDefault();


const data =
Object.fromEntries(
new FormData(
event.target
)
);


const result =
await api(
'/donations',
{
method: 'POST',
body:
JSON.stringify(data)
}
);


if (result !== null) {

setSent(true);

} else {

alert(
'Unable to record donation details right now.'
);

}

}


function selectAmount(amount) {

const input =
document.querySelector(
'#amount'
);


if (input) {
input.value = amount;
}

}


return (

<Layout>

<PageHero
title="Support Our Mission"
subtitle="Your contribution can help provide food, education, healthcare, clothing and essential support."
/>


<section className="donate">

<div className="donate-info">

<h2>
Every contribution matters.
</h2>


<p>
Fill in your details and let us know how you would
like to support the foundation.
</p>


<p>
Once your details are submitted successfully,
our team will connect with you soon.
</p>


<div className="donate-support-box">

<h3>
Your support can make a difference
</h3>

<div className="donate-support-item">
<span className="donate-support-icon">
<Utensils />
</span>

<div>
<strong>Food & Essential Support</strong>
<p>
Help provide meals and essential items
to people and families in need.
</p>
</div>
</div>


<div className="donate-support-item">
<span className="donate-support-icon">
<GraduationCap />
</span>

<div>
<strong>Education Support</strong>
<p>
Support students with educational
supplies and learning resources.
</p>
</div>
</div>


<div className="donate-support-item">
<span className="donate-support-icon">
<Stethoscope />
</span>

<div>
<strong>Healthcare Support</strong>
<p>
Contribute towards healthcare initiatives
and medical support.
</p>
</div>
</div>

</div>

</div>


<form
onSubmit={submit}
>

<div className="amounts">

{[100, 250, 500, 1000, 2500].map(
(amount) => (

<button
type="button"
key={amount}
onClick={() =>
selectAmount(
amount
)
}
>
₹{amount}
</button>

)
)}

</div>


<label>
Name

<input
name="donor_name"
required
/>

</label>


<label>
Mobile

<input
name="mobile"
required
/>

</label>


<label>
Email

<input
name="email"
type="email"
/>

</label>


<label>
Amount (₹)

<input
id="amount"
name="amount"
type="number"
min="1"
required
/>

</label>


<label>
Purpose

<input
name="purpose"
placeholder="Food, education, healthcare..."
/>

</label>


<button
className="btn"
type="submit"
>
Submit Donation Details
<Heart />
</button>


{sent && (

<div className="success">

Thank you! Your donation details have been
received successfully. Our team will connect
with you soon. ❤️

</div>

)}

</form>

</section>

</Layout>
);
}


/* =========================================================
ADMIN ACTIVITIES
========================================================= */

function ActivitiesAdmin() {

const [activities, setActivities] =
useState([]);

const [editingId, setEditingId] =
useState(null);

const [form, setForm] =
useState({
title: '',
icon: 'HandHeart',
description: ''
});


const loadActivities =
async () => {

const data =
await api(
'/activities'
);


if (Array.isArray(data)) {
setActivities(data);
}

};


useEffect(() => {

loadActivities();

}, []);


const resetForm =
() => {

setEditingId(null);

setForm({
title: '',
icon: 'HandHeart',
description: ''
});

};


const handleSubmit =
async (e) => {

e.preventDefault();


if (
!form.title.trim() ||
!form.description.trim()
) {

alert(
'Please fill all required fields.'
);

return;

}


const method =
editingId
? 'PUT'
: 'POST';


const endpoint =
editingId
? `/activities/${editingId}`
: '/activities';


try {

const response =
await fetch(
API + endpoint,
{
method,

headers: adminHeaders({
'Content-Type':
'application/json'
}),

body:
JSON.stringify(form)
}
);


if (response.ok) {

alert(
editingId
? 'Activity updated successfully!'
: 'Activity added successfully!'
);


resetForm();

await loadActivities();

} else {

alert(
'Failed to save activity.'
);

}

} catch (error) {

console.error(error);

alert(
'Something went wrong.'
);

}

};


const handleEdit =
(activity) => {

setEditingId(
activity.id
);


setForm({
title:
activity.title || '',

icon:
activity.icon ||
'HandHeart',

description:
activity.description ||
''
});

};


const handleDelete =
async (id) => {

if (
!window.confirm(
'Are you sure you want to delete this activity?'
)
) {
return;
}


const response =
await fetch(
`${API}/activities/${id}`,
{
method: 'DELETE',
headers: adminHeaders()
}
);


if (response.ok) {

await loadActivities();

} else {

alert(
'Failed to delete activity.'
);

}

};


return (

<div className="admin-panel">

<h2>
Activities Management
</h2>


<p>
Add, edit or delete the social activities
displayed on the website.
</p>


<form
onSubmit={
handleSubmit
}
>

<div className="form-group">

<label>
Activity Title
</label>

<input
value={form.title}
onChange={(e) =>
setForm({
...form,
title:
e.target.value
})
}
placeholder="Example: Food Distribution"
/>

</div>


<div className="form-group">

<label>
Activity Icon
</label>

<select
value={form.icon}
onChange={(e) =>
setForm({
...form,
icon:
e.target.value
})
}
>

<option value="Utensils">
Utensils
</option>

<option value="HandHeart">
HandHeart
</option>

<option value="GraduationCap">
GraduationCap
</option>

<option value="Stethoscope">
Stethoscope
</option>

<option value="Heart">
Heart
</option>

</select>

</div>


<div className="form-group">

<label>
Description
</label>

<textarea
rows="5"
value={
form.description
}
onChange={(e) =>
setForm({
...form,
description:
e.target.value
})
}
/>

</div>


<div className="form-actions">

<button
className="btn"
type="submit"
>
{editingId
? 'Update Activity'
: 'Add Activity'}
</button>


{editingId && (

<button
className="btn ghost"
type="button"
onClick={
resetForm
}
>
Cancel
</button>

)}

</div>

</form>


<hr />


<h3>
Existing Activities
</h3>


<div className="cards">

{activities.map(
(activity) => (

<div
className="card"
key={activity.id}
>

<div className="icon">

<ActivityIcon
name={
activity.icon
}
/>

</div>


<h3>
{activity.title}
</h3>


<p>
{activity.description}
</p>


<div className="form-actions">

<button
className="btn"
onClick={() =>
handleEdit(
activity
)
}
>
Edit
</button>


<button
className="btn ghost"
onClick={() =>
handleDelete(
activity.id
)
}
>
Delete
</button>

</div>

</div>

)
)}

</div>

</div>
);
}


/* =========================================================
ADMIN EVENTS
========================================================= */

function EventsAdmin() {

const emptyForm = {
title: '',
date: '',
time: '',
location: '',
description: '',
beneficiaries: '',
status: 'Upcoming'
};


const [events, setEvents] =
useState([]);


const [form, setForm] =
useState(emptyForm);


const [editingId, setEditingId] =
useState(null);


const loadEvents =
async () => {

const data =
await api('/events');


if (Array.isArray(data)) {
setEvents(data);
}

};


useEffect(() => {

loadEvents();

}, []);


const resetForm =
() => {

setForm(
emptyForm
);

setEditingId(null);

};


const submit =
async (e) => {

e.preventDefault();


if (
!form.title.trim() ||
!form.date ||
!form.description.trim()
) {

alert(
'Please fill the required fields.'
);

return;

}


const endpoint =
editingId
? `/events/${editingId}`
: '/events';


const response =
await fetch(
API + endpoint,
{
method:
editingId
? 'PUT'
: 'POST',

headers: adminHeaders({
'Content-Type':
'application/json'
}),

body:
JSON.stringify(form)
}
);


if (response.ok) {

alert(
editingId
? 'Event updated successfully!'
: 'Event added successfully!'
);


resetForm();

loadEvents();

} else {

alert(
'Failed to save event.'
);

}

};


const edit =
(event) => {

setEditingId(
event.id
);


setForm({
title:
event.title || '',

date:
event.date || '',

time:
event.time || '',

location:
event.location || '',

description:
event.description || '',

beneficiaries:
event.beneficiaries || '',

status:
event.status ||
'Upcoming'
});


window.scrollTo({
top: 0,
behavior: 'smooth'
});

};


const remove =
async (id) => {

if (
!window.confirm(
'Delete this event?'
)
) {
return;
}


const response =
await fetch(
`${API}/events/${id}`,
{
method: 'DELETE',
headers: adminHeaders()
}
);


if (response.ok) {

loadEvents();

} else {

alert(
'Failed to delete event.'
);

}

};


return (

<div className="admin-panel">

<div className="panel-heading">

<div>

<h2>
Events Management
</h2>

<p>
Add, edit and delete foundation events.
</p>

</div>

</div>


<form
onSubmit={submit}
>

<div className="edit-grid">

<label>
Event Title *

<input
value={form.title}
onChange={(e) =>
setForm({
...form,
title:
e.target.value
})
}
required
/>

</label>


<label>
Date *

<input
type="date"
value={form.date}
onChange={(e) =>
setForm({
...form,
date:
e.target.value
})
}
required
/>

</label>


<label>
Time

<input
type="time"
value={form.time}
onChange={(e) =>
setForm({
...form,
time:
e.target.value
})
}
/>

</label>


<label>
Location

<input
value={form.location}
onChange={(e) =>
setForm({
...form,
location:
e.target.value
})
}
/>

</label>


<label>
Beneficiaries

<input
value={
form.beneficiaries
}
onChange={(e) =>
setForm({
...form,
beneficiaries:
e.target.value
})
}
placeholder="Example: 100 people"
/>

</label>


<label>
Status

<select
value={
form.status
}
onChange={(e) =>
setForm({
...form,
status:
e.target.value
})
}
>

<option>
Upcoming
</option>

<option>
Ongoing
</option>

<option>
Completed
</option>

</select>

</label>

</div>


<label>
Description *

<textarea
rows="5"
value={
form.description
}
onChange={(e) =>
setForm({
...form,
description:
e.target.value
})
}
required
/>

</label>


<div className="form-actions">

<button
className="btn"
type="submit"
>
{editingId
? 'Update Event'
: 'Add Event'}
</button>


{editingId && (

<button
className="btn ghost"
type="button"
onClick={
resetForm
}
>
Cancel
</button>

)}

</div>

</form>


<hr />


<h3>
Existing Events
</h3>


<div className="cards">

{events.map(
(event) => (

<div
className="card"
key={event.id}
>

<div className="icon">
<CalendarDays />
</div>


<h3>
{event.title}
</h3>


<p>
{event.description}
</p>


<p>
<strong>
Date:
</strong>{' '}
{event.date}
</p>


<p>
<strong>
Status:
</strong>{' '}
{event.status}
</p>


<div className="form-actions">

<button
className="btn"
onClick={() =>
edit(event)
}
>
Edit
</button>


<button
className="btn ghost"
onClick={() =>
remove(
event.id
)
}
>
Delete
</button>

</div>

</div>

)
)}

</div>

</div>
);
}


/* =========================================================
ADMIN TEAM
========================================================= */

function TeamAdmin() {

const emptyForm = {
name: '',
role: '',
description: '',
image: ''
};


const [team, setTeam] =
useState([]);


const [form, setForm] =
useState(emptyForm);


const [editingId, setEditingId] =
useState(null);


/* FILE UPLOAD STATES */

const [file, setFile] =
useState(null);

const [preview, setPreview] =
useState('');

const [uploading, setUploading] =
useState(false);

const [zoom, setZoom] = useState(1);
const [positionX, setPositionX] = useState(50);
const [positionY, setPositionY] = useState(50);

const loadTeam =
async () => {

const data =
await api('/team');


if (Array.isArray(data)) {
setTeam(data);
}

};


useEffect(() => {

loadTeam();

}, []);


const resetForm =
() => {

setForm(
emptyForm
);

setFile(null);

setPreview('');

setEditingId(null);

};


/* =========================================================
FILE SELECTION
========================================================= */

const handleFileChange = (e) => {

const selectedFile =
e.target.files?.[0];

if (!selectedFile) {
return;
}

setFile(selectedFile);

setPreview(
URL.createObjectURL(selectedFile)
);

setZoom(1);
setPositionX(50);
setPositionY(50);
};


/* =========================================================
UPLOAD TEAM IMAGE
SAME UPLOAD METHOD AS GALLERY
========================================================= */

const uploadFile = async () => {

/*
If editing and no new file is selected,
keep the existing image.
*/

if (!file) {
return form.image;
}

setUploading(true);

try {

const image = new Image();

image.src =
URL.createObjectURL(file);

await new Promise((resolve, reject) => {

image.onload = resolve;
image.onerror = reject;

});


/* =====================================================
CREATE CROPPED IMAGE
===================================================== */

const canvas =
document.createElement('canvas');

const size = 600;

canvas.width = size;
canvas.height = size;


const ctx =
canvas.getContext('2d');


/*
Cover the square while keeping
the selected zoom and position.
*/

const scale =
Math.max(
size / image.width,
size / image.height
) * zoom;


const width =
image.width * scale;

const height =
image.height * scale;


/*
Position controlled by sliders.
*/

const x =
(size - width) *
(positionX / 100);


const y =
(size - height) *
(positionY / 100);


ctx.drawImage(
image,
x,
y,
width,
height
);


/* =====================================================
CONVERT CROPPED IMAGE TO FILE
===================================================== */

const blob =
await new Promise(resolve => {

canvas.toBlob(
resolve,
'image/jpeg',
0.92
);

});


if (!blob) {

throw new Error(
'Failed to crop image.'
);

}


const croppedFile =
new File(
[blob],
'team-profile.jpg',
{
type:
'image/jpeg'
}
);


/* =====================================================
UPLOAD CROPPED IMAGE
===================================================== */

const formData =
new FormData();

formData.append(
'file',
croppedFile
);


const response =
await fetch(
`${API}/gallery/upload`,
{
method:
'POST',

headers: adminHeaders(),

body:
formData
}
);


const text =
await response.text();


let data =
null;


try {

data =
JSON.parse(text);

} catch {

data =
null;

}


if (
!response.ok ||
!data?.url
) {

throw new Error(
data?.message ||
'File upload failed.'
);

}


return data.url;


} catch (error) {

alert(
error.message ||
'Failed to upload file.'
);

return null;


} finally {

setUploading(false);

}

};

/* =========================================================
SUBMIT
========================================================= */

const submit =
async (e) => {

e.preventDefault();


if (
!form.name.trim() ||
!form.role.trim()
) {

alert(
'Please enter name and role.'
);

return;

}


/*
Upload new image if selected.
Otherwise keep existing image.
*/

const uploadedUrl =
await uploadFile();


if (
file &&
!uploadedUrl
) {

return;

}


const teamData = {

...form,

image:
uploadedUrl || ''

};


const endpoint =
editingId
? `/team/${editingId}`
: '/team';


const response =
await fetch(
API + endpoint,
{
method:
editingId
? 'PUT'
: 'POST',

headers: adminHeaders({
'Content-Type':
'application/json'
}),

body:
JSON.stringify(
teamData
)

}
);


if (response.ok) {

alert(
editingId
? 'Team member updated successfully!'
: 'Team member added successfully!'
);


resetForm();


loadTeam();


} else {

alert(
'Failed to save team member.'
);

}

};


/* =========================================================
EDIT
========================================================= */

const edit =
(member) => {

setEditingId(
member.id
);


setForm({

name:
member.name || '',

role:
member.role || '',

description:
member.description ||
'',

image:
member.image || ''

});


/*
Show existing image
when editing.
*/

setPreview(
member.image || ''
);


/*
No new file selected yet.
Existing image will be preserved.
*/

setFile(null);


window.scrollTo({

top: 0,

behavior:
'smooth'

});

};


/* =========================================================
DELETE
========================================================= */

const remove =
async (id) => {

if (
!window.confirm(
'Delete this team member?'
)
) {

return;

}


const response =
await fetch(
`${API}/team/${id}`,
{
method:
'DELETE',
headers: adminHeaders()
}
);


if (response.ok) {

loadTeam();

} else {

alert(
'Failed to delete team member.'
);

}

};


return (

<div className="admin-panel">

<h2>
Team Management
</h2>


<p>
Add, edit or remove founders and core team members.
</p>


<form
onSubmit={submit}
>

<div className="edit-grid">


{/* NAME */}

<label>

Name *

<input
value={
form.name
}

onChange={(e) =>
setForm({
...form,

name:
e.target.value
})
}

required
/>

</label>


{/* ROLE */}

<label>

Role *

<input
value={
form.role
}

onChange={(e) =>
setForm({
...form,

role:
e.target.value
})
}

placeholder="Founder / Director / Volunteer"

required
/>

</label>


{/* =================================================
FILE UPLOAD
================================================= */}

<label>

Upload Image

<input
type="file"

accept="image/*"

onChange={
handleFileChange
}

/>

<small>
Choose an image from your device.
</small>

</label>


{/* =================================================
PREVIEW
================================================= */}

{preview && (

<div
style={{
marginTop: '15px'
}}
>

<strong>
Adjust Profile Photo
</strong>

{/* CIRCLE PREVIEW */}

<div
style={{
width: '180px',
height: '180px',
borderRadius: '50%',
overflow: 'hidden',
margin: '15px auto',
border: '3px solid #d34f5f',
background: '#eee'
}}
>

<img
src={preview}
alt="Team Preview"
style={{
width: '100%',
height: '100%',
objectFit: 'cover',

objectPosition:
`${positionX}% ${positionY}%`,

transform:
`scale(${zoom})`,

transformOrigin:
'center center'
}}
/>

</div>


{/* ZOOM */}

<label>

Zoom

<input
type="range"
min="1"
max="3"
step="0.05"
value={zoom}
onChange={(e) =>
setZoom(
Number(e.target.value)
)
}
/>

</label>


{/* HORIZONTAL */}

<label>

Horizontal Position

<input
type="range"
min="0"
max="100"
value={positionX}
onChange={(e) =>
setPositionX(
Number(e.target.value)
)
}
/>

</label>


{/* VERTICAL */}

<label>

Vertical Position

<input
type="range"
min="0"
max="100"
value={positionY}
onChange={(e) =>
setPositionY(
Number(e.target.value)
)
}
/>

</label>

</div>

)}

</div>


{/* DESCRIPTION */}

<label>

Description

<textarea
rows="5"

value={
form.description
}

onChange={(e) =>
setForm({
...form,

description:
e.target.value
})
}

/>

</label>


{/* BUTTONS */}

<div className="form-actions">

<button
className="btn"
type="submit"
disabled={uploading}
>

{uploading
? 'Uploading...'
: editingId
? 'Update Team Member'
: 'Add Team Member'}

</button>


{editingId && (

<button
className="btn ghost"
type="button"
onClick={
resetForm
}
>

Cancel

</button>

)}

</div>

</form>


<hr />


<h3>
Existing Team Members
</h3>


<div className="cards team">

{team.map(
(member) => (

<div
className="team-card"
key={
member.id
}
>


{member.image ? (

<img
src={
member.image
}

alt={
member.name
}
/>

) : (

<div className="avatar">
PHF
</div>

)}


<h3>
{member.name}
</h3>


<p>

<strong>
{member.role}
</strong>

</p>


<p>
{member.description}
</p>


<div className="form-actions">

<button
className="btn"
type="button"
onClick={() =>
edit(member)
}
>

Edit

</button>


<button
className="btn ghost"
type="button"
onClick={() =>
remove(
member.id
)
}
>

Delete

</button>

</div>

</div>

)
)}

</div>

</div>

);

}


/* =========================================================
ADMIN GALLERY
========================================================= */

function GalleryAdmin() {

const emptyForm = {

title: '',

category:
'Photos',

type:
'image',

media_url:
'',

event:
'',

date:
'',

location:
'',

description:
''

};


const [gallery, setGallery] =
useState([]);


const [form, setForm] =
useState(emptyForm);


const [editingId, setEditingId] =
useState(null);


/* FILE UPLOAD STATES */

const [file, setFile] =
useState(null);


const [preview, setPreview] =
useState('');


const [uploading, setUploading] =
useState(false);


const loadGallery =
async () => {

const data =
await api('/gallery');


if (Array.isArray(data)) {

setGallery(
data
);

}

};


useEffect(() => {

loadGallery();

}, []);


const resetForm =
() => {

setForm(
emptyForm
);

setFile(null);

setPreview('');

setEditingId(null);

};


/* =========================================================
FILE SELECTION
========================================================= */

const handleFileChange =
(e) => {

const selectedFile =
e.target.files?.[0];


if (!selectedFile) {
return;
}


setFile(
selectedFile
);


const fileType =
selectedFile.type.startsWith(
'video/'
)
? 'video'
: 'image';


setForm(
prev => ({
...prev,

type:
fileType

})
);


setPreview(
URL.createObjectURL(
selectedFile
)
);

};


/* =========================================================
UPLOAD FILE
========================================================= */

const uploadFile =
async () => {

/*
IMPORTANT:
If editing and no new file is selected,
return the existing media_url.
*/

if (!file) {

return form.media_url;

}


setUploading(true);


try {

const formData =
new FormData();


formData.append(
'file',
file
);


const response =
await fetch(
`${API}/gallery/upload`,
{
method:
'POST',

headers: adminHeaders(),

body:
formData
}
);


const text =
await response.text();


let data =
null;


try {

data =
JSON.parse(
text
);

} catch {

data =
null;

}


if (
!response.ok ||
!data?.url
) {

throw new Error(
data?.message ||
'File upload failed.'
);

}


return data.url;


} catch (error) {

alert(
error.message ||
'Failed to upload file.'
);


return null;


} finally {

setUploading(
false
);

}

};


/* =========================================================
SUBMIT
========================================================= */

const submit =
async (e) => {

e.preventDefault();


/*
TITLE IS OPTIONAL.
*/


/*
Upload new media if selected.
Otherwise existing media_url is preserved.
*/

const uploadedUrl =
await uploadFile();


if (
file &&
!uploadedUrl
) {

return;

}


if (
!uploadedUrl
) {

alert(
'Please select an image or video.'
);

return;

}


const galleryData = {

...form,

media_url:
uploadedUrl

};


const endpoint =
editingId
? `/gallery/${editingId}`
: '/gallery';


const response =
await fetch(
API + endpoint,
{

method:
editingId
? 'PUT'
: 'POST',

headers: adminHeaders({

'Content-Type':
'application/json'

}),

body:
JSON.stringify(
galleryData
)

}
);


if (response.ok) {

alert(

editingId

? 'Gallery item updated successfully!'

: 'Gallery item added successfully!'

);


resetForm();


loadGallery();


} else {

alert(
'Failed to save gallery item.'
);

}

};


/* =========================================================
EDIT
========================================================= */

const edit =
(item) => {

setEditingId(
item.id
);


setForm({

title:
item.title || '',

category:
item.category ||
'Photos',

type:
item.type ||
'image',

/*
IMPORTANT:
Load existing media_url.
*/

media_url:
item.media_url ||
'',

event:
item.event ||
'',

date:
item.date ||
'',

location:
item.location ||
'',

description:
item.description ||
''

});


/*
Show existing image/video.
*/

setPreview(
item.media_url ||
''
);


/*
No new file selected.
Existing media will be preserved.
*/

setFile(
null
);


window.scrollTo({

top:
0,

behavior:
'smooth'

});

};


/* =========================================================
DELETE
========================================================= */

const remove =
async (id) => {

if (
!window.confirm(
'Delete this gallery item?'
)
) {

return;

}


const response =
await fetch(

`${API}/gallery/${id}`,

{
method:
'DELETE',
headers: adminHeaders()
}

);


if (response.ok) {

loadGallery();

} else {

alert(
'Failed to delete gallery item.'
);

}

};


return (

<div className="admin-panel">

<h2>
Gallery Management
</h2>


<p>
Add photos and videos from foundation activities,
events and celebrations.
</p>


<form
onSubmit={
submit
}
>

<div className="edit-grid">


{/* TITLE */}

<label>

Title

<input

value={
form.title
}

onChange={(e) =>
setForm({

...form,

title:
e.target.value

})
}

/>

</label>


{/* CATEGORY */}

<label>

Category

<select

value={
form.category
}

onChange={(e) =>
setForm({

...form,

category:
e.target.value

})
}

>

<option>
Photos
</option>

<option>
Videos
</option>

<option>
Events
</option>

<option>
Medical Camps
</option>

<option>
Food Distribution
</option>

<option>
Celebrations
</option>

</select>

</label>


{/* MEDIA TYPE */}

<label>

Media Type

<select

value={
form.type
}

onChange={(e) =>
setForm({

...form,

type:
e.target.value

})
}

>

<option value="image">
Image
</option>

<option value="video">
Video
</option>

</select>

</label>


{/* FILE UPLOAD */}

<label>

Upload Image / Video *

<input

type="file"

accept="image/*,video/*"

onChange={
handleFileChange
}

/>

<small>

Choose an image or video
from your device.

</small>

</label>


{/* PREVIEW */}

{preview && (

<div
style={{
marginTop:
'10px'
}}
>

<strong>
Preview
</strong>


{form.type === 'video' ? (

<video

src={
preview
}

controls

style={{

display:
'block',

width:
'100%',

maxWidth:
'500px',

maxHeight:
'300px',

marginTop:
'10px',

borderRadius:
'8px',

objectFit:
'cover'

}}

/>

) : (

<img

src={
preview
}

alt="Preview"

style={{

display:
'block',

width:
'100%',

maxWidth:
'500px',

maxHeight:
'300px',

marginTop:
'10px',

borderRadius:
'8px',

objectFit:
'cover'

}}

/>

)}

</div>

)}


{/* EVENT */}

<label>

Event

<input

value={
form.event
}

onChange={(e) =>
setForm({

...form,

event:
e.target.value

})
}

/>

</label>


{/* DATE */}

<label>

Date

<input

type="date"

value={
form.date
}

onChange={(e) =>
setForm({

...form,

date:
e.target.value

})
}

/>

</label>


{/* LOCATION */}

<label>

Location

<input

value={
form.location
}

onChange={(e) =>
setForm({

...form,

location:
e.target.value

})
}

/>

</label>


</div>


{/* DESCRIPTION */}

<label>

Description

<textarea

rows="4"

value={
form.description
}

onChange={(e) =>
setForm({

...form,

description:
e.target.value

})
}

/>

</label>


{/* BUTTONS */}

<div className="form-actions">

<button

className="btn"

type="submit"

disabled={
uploading
}

>

{uploading

? 'Uploading...'

: editingId

? 'Update Gallery Item'

: 'Add Gallery Item'

}

</button>


{editingId && (

<button

className="btn ghost"

type="button"

onClick={
resetForm
}

>

Cancel

</button>

)}

</div>

</form>


<hr />


<h3>
Existing Gallery Items
</h3>


<div className="gallery">

{gallery.map(
(item) => (

<div

className="gallery-item"

key={
item.id
}

>


{item.type === 'video' ? (

<div
className="gallery-video"
>

<video

controls

src={
item.media_url
}

/>

</div>

) : (

<img

src={
item.media_url
}

alt={
item.title
}

/>

)}


{item.title && (

<span>
{item.title}
</span>

)}


{item.location && (

<small>
{item.location}
</small>

)}


<div className="form-actions">

<button

className="btn"

type="button"

onClick={() =>
edit(item)
}

>

Edit

</button>


<button

className="btn ghost"

type="button"

onClick={() =>
remove(
item.id
)
}

>

Delete

</button>

</div>

</div>

)
)}

</div>

</div>

);

}

/* =========================================================
ADMIN
========================================================= */

function Admin() {

const [login, setLogin] =
useState(null);


const [creds, setCreds] =
useState({
email: '',
password: ''
});


const [impact, setImpact] =
useState(
fallback.impact
);


const [submissions, setSubmissions] =
useState([]);


const [activeSection, setActiveSection] =
useState('Dashboard');


const [loadingSubmissions, setLoadingSubmissions] =
useState(false);


const [loginError, setLoginError] =
useState('');


const [saveMessage, setSaveMessage] =
useState('');


/* =======================================================
LOGIN
======================================================= */

async function doLogin(event) {

event.preventDefault();

setLoginError('');


const response =
await api(
'/admin/login',
{
method: 'POST',
body:
JSON.stringify(
creds
)
}
);


if (response?.token) {

localStorage.setItem(
'adminToken',
response.token
);

setLogin(true);

} else {

setLoginError(
'Invalid email or password.'
);

}

}


/* =======================================================
LOAD SUBMISSIONS
======================================================= */

async function loadSubmissions() {

setLoadingSubmissions(true);


const token =
localStorage.getItem(
'adminToken'
);


try {

const response =
await fetch(
API +
'/admin/submissions',
{
headers: {
Authorization:
`Bearer ${token}`
}
}
);


if (response.ok) {

const data =
await response.json();

setSubmissions(data);

}

} catch (error) {

console.error(error);

} finally {

setLoadingSubmissions(false);

}

}


/* =======================================================
INITIAL LOAD
======================================================= */

useEffect(() => {

const token =
localStorage.getItem(
'adminToken'
);


api('/impact')
.then((data) => {

if (data) {
setImpact(data);
}

});


if (!token) {

setLogin(false);

return;

}


fetch(
API + '/admin/verify',
{
headers: adminHeaders()
}
)
.then((response) => {

if (response.ok) {

setLogin(true);

loadSubmissions();

} else {

localStorage.removeItem(
'adminToken'
);

setLogin(false);

}

})
.catch(() => {

localStorage.removeItem(
'adminToken'
);

setLogin(false);

});

}, []);


/* =======================================================
LOGIN SCREEN
======================================================= */

if (login === null) {

return (

<div className="admin-login">

<p>Checking authentication...</p>

</div>

);

}


if (!login) {

return (

<div className="admin-login">

<form
onSubmit={doLogin}
>

<Heart />

<h1>
Admin Login
</h1>

<p>
People’s Hand Foundation
</p>


<input
placeholder="Email"
type="email"
value={
creds.email
}
onChange={(event) =>
setCreds({
...creds,
email:
event.target.value
})
}
required
/>


<input
placeholder="Password"
type="password"
value={
creds.password
}
onChange={(event) =>
setCreds({
...creds,
password:
event.target.value
})
}
required
/>


<button
className="btn"
type="submit"
>
Sign In
</button>


{loginError && (

<div className="error-message">
{loginError}
</div>

)}

</form>

</div>
);
}


/* =======================================================
FILTER SUBMISSIONS
======================================================= */

const volunteers =
submissions.filter(
(item) =>
item.type ===
'volunteer'
);


const donations =
submissions.filter(
(item) =>
item.type ===
'donation'
);


const celebrations =
submissions.filter(
(item) =>
item.type ===
'celebration'
);


const messages =
submissions.filter(
(item) =>
item.type ===
'message'
);


/* =======================================================
SUBMISSION CARD
======================================================= */

function SubmissionCard({
item
}) {

const data =
item.data || {};


return (

<div className="submission-card">

<div className="submission-head">

<div>

<span className="submission-type">
{item.type}
</span>


<h3>

{data.name ||
data.donor_name ||
data.full_name ||
'Submission'}

</h3>

</div>


<span className="submission-date">
{item.created_at}
</span>

</div>


<div className="submission-data">

{Object.entries(data).map(
([key, value]) => (

<div
className="submission-field"
key={key}
>

<strong>
{key.replaceAll(
'_',
' '
)}
</strong>


<span>
{String(value)}
</span>

</div>

)
)}

</div>

</div>
);
}


/* =======================================================
SUBMISSION SECTION
======================================================= */

function SubmissionSection({
title,
data
}) {

return (

<div className="admin-panel">

<div className="panel-heading">

<div>

<h2>
{title}
</h2>

<p>
{data.length}{' '}
submission
{data.length !== 1
? 's'
: ''}
</p>

</div>


<button
className="btn ghost"
onClick={
loadSubmissions
}
>
Refresh
</button>

</div>


{loadingSubmissions ? (

<p>
Loading submissions...
</p>

) : data.length === 0 ? (

<div className="empty-state">

<Heart />

<p>
No submissions yet.
</p>

</div>

) : (

<div className="submission-list">

{data.map(
(item) => (

<SubmissionCard
key={
item.id
}
item={item}
/>

)
)}

</div>

)}

</div>
);
}


/* =======================================================
DASHBOARD
======================================================= */

function DashboardContent() {

return (

<>

<div className="dash-stats">

<div>
<span>
People Supported
</span>

<strong>
{impact.people_supported}+
</strong>
</div>


<div>
<span>
Meals Distributed
</span>

<strong>
{impact.meals_distributed}+
</strong>
</div>


<div>
<span>
Students Supported
</span>

<strong>
{impact.students_supported}+
</strong>
</div>


<div>
<span>
Medical Camps
</span>

<strong>
{impact.medical_camps}+
</strong>
</div>


<div>
<span>
Volunteers
</span>

<strong>
{volunteers.length}+
</strong>
</div>


<div>
<span>
Total Submissions
</span>

<strong>
{submissions.length}+
</strong>
</div>

</div>


<div className="admin-panel">

<h2>
Recent Submissions
</h2>


<p>
Latest forms received through
the website.
</p>


{submissions.length === 0 ? (

<p>
No submissions yet.
</p>

) : (

<div className="submission-list">

{submissions
.slice(0, 5)
.map(
(item) => (

<SubmissionCard
key={
item.id
}
item={
item
}
/>

)
)}

</div>

)}

</div>

</>
);
}


/* =======================================================
IMPACT ADMIN
======================================================= */

function ImpactSection() {

return (

<div className="admin-panel">

<h2>
Impact Statistics
</h2>


<p>
These figures are connected to
the public impact section.
</p>


<div className="edit-grid">

{Object.entries(
impact
)
.filter(
([key]) =>
key !== 'id'
)
.map(
([key, value]) => (

<label
key={key}
>

{key.replaceAll(
'_',
' '
)}


<input
type="number"
value={value}
onChange={(event) =>
setImpact({
...impact,
[key]:
event.target.value
})
}
/>

</label>

)
)}

</div>


<button
className="btn"
onClick={async () => {

const response =
await api(
'/impact',
{
method: 'PUT',
headers: adminHeaders({
'Content-Type':
'application/json'
}),
body:
JSON.stringify(
impact
)
}
);


if (response) {

setImpact(
response
);


setSaveMessage(
'Impact statistics saved successfully.'
);


setTimeout(
() =>
setSaveMessage(
''
),
3000
);

}

}}
>
Save Impact
</button>


{saveMessage && (

<div className="success">
{saveMessage}
</div>

)}

</div>
);
}


/* =======================================================
ADMIN UI
======================================================= */

return (

<div className="dashboard">

<aside>

<Link
className="brand"
to="/"
>

<span className="logo">
<Heart />
</span>

PHF

</Link>


<h4>
ADMIN
</h4>


{[
'Dashboard',
'Impact',
'Activities',
'Events',
'Gallery',
'Team',
'Volunteers',
'Donations',
'Celebrations',
'Messages',
'Settings'
].map(
(item) => (

<button
key={item}
className={
activeSection ===
item
? 'admin-nav active'
: 'admin-nav'
}
onClick={() =>
setActiveSection(
item
)
}
>
{item}
</button>

)
)}


<button
className="admin-signout"
onClick={() => {

localStorage.removeItem(
'adminToken'
);

setLogin(false);

}}
>
Sign out
</button>

</aside>


<section className="dash-main">

<div className="dash-head">

<div>

<p className="eyebrow">
ADMIN DASHBOARD
</p>


<h1>
{activeSection}
</h1>

</div>


<Link
to="/"
className="btn ghost"
>
View Website
</Link>

</div>


{activeSection ===
'Dashboard' && (

<DashboardContent />

)}


{activeSection ===
'Impact' && (

<ImpactSection />

)}


{activeSection ===
'Activities' && (

<ActivitiesAdmin />

)}


{activeSection ===
'Events' && (

<EventsAdmin />

)}


{activeSection ===
'Gallery' && (

<GalleryAdmin />

)}


{activeSection ===
'Team' && (

<TeamAdmin />

)}


{activeSection ===
'Volunteers' && (

<SubmissionSection
title="Volunteer Submissions"
data={
volunteers
}
/>

)}


{activeSection ===
'Donations' && (

<SubmissionSection
title="Donation Submissions"
data={
donations
}
/>

)}


{activeSection ===
'Celebrations' && (

<SubmissionSection
title="Celebration Requests"
data={
celebrations
}
/>

)}


{activeSection ===
'Messages' && (

<SubmissionSection
title="Contact Messages"
data={
messages
}
/>

)}


{activeSection ===
'Settings' && (

<div className="admin-panel">

<h2>
Settings
</h2>

<p>
Foundation settings can be
connected here.
</p>

</div>

)}

</section>

</div>
);
}


/* =========================================================
APP
========================================================= */

function App() {

return (

<Routes>

<Route
path="/"
element={<Home />}
/>


<Route
path="/about"
element={<About />}
/>


<Route
path="/activities"
element={<Activities />}
/>


<Route
path="/activities/:id"
element={<ActivityDetails />}
/>


<Route
path="/impact"
element={<ImpactPage />}
/>


<Route
path="/events"
element={<Events />}
/>


<Route
path="/events/:id"
element={<EventDetails />}
/>


<Route
path="/donate"
element={<Donate />}
/>


<Route
path="/volunteer"
element={
<FormPage
type="volunteer"
/>
}
/>


<Route
path="/team"
element={<Team />}
/>


<Route
path="/gallery"
element={<Gallery />}
/>


<Route
path="/contact"
element={
<FormPage
type="contact"
/>
}
/>


<Route
path="/admin/*"
element={<Admin />}
/>

</Routes>
);
}


/* =========================================================
ROOT
========================================================= */

createRoot(
document.getElementById('root')
).render(

<BrowserRouter>

<ScrollToTop />

<App />

</BrowserRouter>

);