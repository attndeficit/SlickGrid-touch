========================
What I Did For Packaging
========================

Whenever I package up SlickGrid for deployment, and an example,
I repeat a bunch of steps over and over. Primarily this is because
important stuff (from my POV) is spread across slick.grid.css and
examples.css. But equally, the examples put everything in one HTML
file, with some relative references that never quite work out right.

So, here's what I did.

Demo 01
=======

The goal on this was pretty unambitious. No replacing jqUI themes with
Twitter Bootstrap, no juicing. Just point at the SlickGrid stuff,
but solve the examples.css mishmash issue.

This example is purposely very dumb. No row selection, editing,
dragging. Not even a model! The goal is was to make something so small
and concise as a first step, it could all fit in my brain.

Along the way, I tried very hard to only include the JS (especially
from plugins) that was absolutely needed.

#. Made demo01 html/css/js.

#. Created a ``sgt/css/sgt.css`` as the disentangling of the mishmash.

#. Chose all the correct ``.js`` to include.

Demo 02
=======

SlickGrid uses jQuery UI themes. SGT could keep this and get the
Bootstrap theme for jQuery UI. But that still means 1,
300+ lines of CSS injected into the equation.

How much of jqUI themes is used by SlickGrid? For the stuff in Demo 01,
only 11 lines (I think) of JS point at a class in jqUI. So I copied the
rules out of jquery-ui-1.8.16.custom.css into sgt02.css.

It worked! Of course it is naive. But maybe feasible.


