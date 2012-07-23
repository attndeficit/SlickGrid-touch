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
genesis of the SlickGrid Touch project.

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

In Bento, a grid always has something selected. On a new library
(database), it's the first row. Scrolling within a grid via swipe does
not change the selection. Pressing down for a second hand holding,
then swiping has no effect (no scroll, no selection.) Swiping near the
top pulls the whole grid down, even the column headers,
revealing a dark gray background behind. While scrolling is happening,
scroll bars appear. Initiating a scroll with a touch in the column
header pulls the entire grid down, then bounces it back up (but doesn't
scroll.)

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


Layout
------

Getting

- Large targets

- Fills the height, but not too much

- 4 form factors (including column settings)

- Re-layouts when orientation changes

- Row height


Visiting
--------

- Transitions

- In-place visiting, Back button

Notes

- Tap and hold to get contextual menu

- Swipe (to scroll)

- Open (view)

- Select

- Double tap

- Swipe left to reveal delete



Grids for Power Viewers
=======================

- Analysis, diving around, etc.

