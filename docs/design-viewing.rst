===================================
Touch Support for SlickGrid Viewers
===================================

.. note::

    This spec focuses exclusively on tablet support. It isn't clear
    whether phones should have columns in any orientation. Without
    columns, everything is quite different.

SlickGrid is great as a high-performance, feature-ful grid for desktop
browsers.

Touch-oriented (tablet, phone) browsers? Not so much. That's the
genesis of the SlickGrid Touch (*SGT*) project.

In this document, we look at the use cases and gestures for viewers and
power viewers. Not user who add rows or do inline editing,
or re-ordering. That's in the other design document.

Our goal in these two documents is to describe in great detail the
various gestures and what user goals are behind them. Along the way,
we compare how some similar iPad apps handle similar gestures and goals.

Grids for Viewers
=================

The sections below discuss interactions by viewers of content. No
editing, deleting, moving, ordering, etc. In fact, just simple
viewing. "Power Viewing" is in the next section.

Layout
------

The most obvious, visible starting point is layout: what does the grid
look like when it is started in various orientations and then
re-oriented?

This design document is restricted to tablets, so in this case we can
just say landscape (wide) and portrait (narrow.) When displaying the
grid, we likely want different columns displayed, possibly at different
default widths, in landscape vs. portrait. We also want to handle
changes in orientation.

If the user has manually resized a column, or turned off 3 columns and
turned on 2, take that into account when changing orientation to
another and then back again.

In both orientations, we want tap targets that are larger than click
targets in the desktop. Column headers and buttons might need to be
bigger. Row height might need to be taller.

Finally, we'd like the grid to fill up the part of the viewport that is
reserved for it. If the grid should go to the bottom of a tablet that
is 900px high, then fill up 900 pixels. Don't show 20 out of 200 rows
and then leave a bunch of empty space underneath.

Bento does a good job of adapting to the two dimensions. More visible
columns are shown and you can horizontally-scroll via swiping to see
more columns. Changing the orientation shows a different number of
columns. Nothing more than normal viewport stuff. Changing the
orientation is smooth and fast. Column header and row height are really
small, but surprisingly it works ok with my finger size.

OmniOutliner was even smoother in transition between orientations. Its
row height and target button size were larger and thus more
tap-friendly, at the expense of how much information could be shown at
once.

Numbers also animated the orientation change nicely. But interestingly,
the default number of columns in the spreadsheet was chosen to fit on
the narrower orientation (portrait.) Row height was similar to Bento.
Buttons were quite small.

Scrolling
---------

In a grid, you have more rows that can fit in the viewport. This means
scrolling. Touch devices generally don't have scrollbars,
but instead rely on a ``swipe-down`` and ``swipe-up`` gesture to do
scrolling. As well, the use acceleration to speed up the speed of
scrolling, and inertia to slow down with a "bounce" effect. Finally,
they have an effect for going past the start/end, which sometimes
triggers some user goal (e.g. reload in Twitter.)

Part of the challenge is the overlap with other events. A scroll starts
with touching inside a grid, which might be like to ``mouse-down``
which could trigger a selection of a row. The motion of a drag swipe
might be like a drag event.

So in summary:

- Swiping down/up replaces scroll bars or other pagination controls

- Acceleration and inertia give a nice experience

- "Top-scroll" might mean something, such as reload

- Scrolling shouldn't trigger other events, such as selection

- Rules for scrolling apply to horizontal (moving between columns) as
  well as vertical (paginating through rows)

In Bento, a grid always has something selected. On a new library
(database), it's the first row. Scrolling within a grid via swipe does
not change the selection. Pressing down for a second hand holding,
then swiping has no effect (no scroll, no selection.) Swiping near the
top pulls the whole grid down, even the column headers,
revealing a dark gray background behind. While scrolling is happening,
scroll bars appear. Initiating a scroll with a touch in the column
header pulls the entire grid down, then bounces it back up (but doesn't
scroll.)

Interestingly, Bento supplements scrolling with a slider at the bottom
that triggers scrolling/selection, along with a left/right arrow that
advances selection and scrolling. Both seem to trigger the same effect
as swiping, just with different acceleration and no inertia. Neither
OmniOutliner nor Numbers has this.

OmniOutliner has some differences. First, an outline doesn't always
have a node selected. Touch and hold *does* change selection. Touch and
hold, then swipe does re-ordering. You do, though, get the same
scrolling effects (scrollbar, acceleration, inertia,
bounce.) Initiating a scroll in the column header briefly highlights
the header but then has no effect.

Numbers doesn't start with a cell/row selected. Scrolling doesn't
change selection, but scrolling is very sensitive to
horizontal/vertical changes. Meaning, it will move your viewport
right/left on visible columns with more sensitivity. Since tapping in
the cells doesn't cause the row to select (you select the row by
tapping in the gutter,) it isn't sensitive to changing selection during
swiping. Scrolling to the top makes the entire canvas bounce,
not just the grid (which makes sense, Numbers can have multiple grids
per sheet.) Initiating a scroll from the column header behaves like
Bento.

Visiting
--------

Ahh, a challenging one!

So far a Viewer has gotten a grid on the screen and scrolled down to the
item they are interested in. For example, a File. They want to make a
gesture and "visit" that File, changing the screen from the grid to
"View File".

What is the gesture the Viewer makes to indicate "visit" (aka "open"?)

A single tap might be the most logical. This is like a click on a link
in a desktop grid. However, this would overlap with selection. A
double-top would overlap with editing.

As a more promising direction, we could have a cell with an ``<a>`` in
it, as we do on the desktop. Tapping on that would trigger "visit".
Tapping anywhere else in the cell, or row, would have other effects
(e.g. selection.)


Notes

- Tap and hold to get contextual menu in header and on a cell

- Select

- Double tap

- Swipe left to reveal delete



Grids for Power Viewers
=======================

- Analysis, diving around, etc.

- Column operations (sorting, resizing, re-ordering,
  showing more columns, hiding columns)

- Filtering

- Grouping operations (turn on/off grouping, collapse/expand)