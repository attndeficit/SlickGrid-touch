========================
What I Did For Packaging
========================

Whenever I package up SlickGrid for deployment, and an example,
I repeat a bunch of steps over and over. Primarily this is because
important stuff (from my POV) is spread across slick.grid.css and
examples.css. But equally, the examples put everything in one HTML
file, with some relative references that never quite work out right.

So, here's what I did.

Demo 01 - Tiny Start
====================

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

Demo 02 - Yank jQuery UI Theme CSS
==================================

SlickGrid uses jQuery UI themes. SGT could keep this and get the
Bootstrap theme for jQuery UI. But that still means 1,
300+ lines of CSS injected into the equation.

How much of jqUI themes is used by SlickGrid? For the stuff in Demo 01,
only 11 lines (I think) of JS point at a class in jqUI. So I copied the
rules out of jquery-ui-1.8.16.custom.css into sgt02.css.

It worked! Of course it is naive. But maybe feasible.


Demo 03 - Slim jQuery UI JS
===========================

SlickGrid won't initialize without jquery-ui-1.8.16.custom.min.js.
But perhaps we can make a much smaller version of that,
including only the widget factory and any pieces that are needed?

For this step I built a jQuery UI download with everything in the core,
plus the "sortable" interaction. Later, when we do column resizing,
it is possible that some other stuff is needed.

For now though, it is 38kb instead of 160kb.

Demo 04 - Richer Grid
=====================

We're at the point where we are making decisions that might break when
we add more features back in. If we do sorting, can we find the icon
for showing the sort direction? How about column resizing?

This step makes a richer demo, so we can then do the juicing step.

- Linked to slick.columnpicker.css...didn't copy over,
  as this might get ripped out

- TODO Previous demos were missing slick-default-theme.css stuff,
  might want to copy back into them
