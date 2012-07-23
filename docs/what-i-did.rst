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

Along the way, I tried very hard to only include the JS (especially
from plugins) that was absolutely needed.

#. Made demo01 html/css/js.

#. Created a ``sgt/css/sgt.css`` as the disentangling of the mishmash.

#. Chose all the correct ``.js`` to include.

