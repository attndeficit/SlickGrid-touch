=================================
Example of How Touch Will Be Used
=================================

*Based on the design docs, a walkthrough for each type of user.*

Viewing
-------

John is a Viewer of resources in a project. From his table he goes to a
folder.

On first load, John's tablet is in portrait. He rotates to landscape to
see more columns. He now has the first 20 of 200 rows visible and the
first 5 of 7 columns visible.

To find the resource he is interested in, John swipes down to scroll
towards the bottom. The column headers don't scroll. His scroll leads to
a bounce off the bottom. He swipes up a bit. John then swipes right to
scroll some other columns into view.

To visit the file, John taps the underlined part of the "title" column.
This changes the URL and visits that resource.

Power Viewing
-------------

Kelly is a Power User in a project. She needs to do some analysis of
the items in the grid, though she isn't someone that can edit content.

Kelly visits the folder with her tablet and gets the same layout. She
first gets her grid setup *her* way by organizing columns. She moves
one column that is out-of-view on the right, over to the left. She does
this by scrolling right until the column is visible,
tapping-and-holding the column header, and dragging to the left. As she
does this, Kelly sees some animation of the column moving and the
potential targets moving out of the way as drop targets.

Next, Kelly resizes a couple of columns. A double-tap on a column
header automatically resizes down to the smallest size that fits.

Kelly then sorts her columns. She taps once on column header and gets a
popup menu of possible operations. On the left is an arrow pointing up
and next is an arrow pointing down. She chooses up. The grid sorts
ascending on that column and displays a sort triangle.

As her final step on column setup, Kelly wants to turn off some columns
and turn on some others. She taps on a column header. The popup menu
with the sorting triangles has other menu items, including "Columns".
She taps that menu item and the popup contents change to show a
scrollable list of all the columns, with a check beside each enabled
column. Tapping a row toggles the checkbox and, behind the popup,
enables/disables that column. Tapping outside of the popup dismisses it.

Kelly then leaves for a while and comes back to the folder. Her column
layout choices are still present.

The items in her folder have a rich set of organization based on a
"Status" column. Kelly would like to group based on status. She taps
the column header for "Status". This gives a popup menu with the
column menu items. She taps "Grouping" and the popup menu changes to
a box that lets her either group based on the values, or lets her order
the listing of groupings. For example, she can put "New" before
"In Progress". Finally, this box also gives the option to display
counts in each group, in parentheses after the value is displayed in
the cell.

Her grid is now grouped, giving her a tap target in the cell for each
group name to collapse/expand the group. Finally, she taps in the filter
box in the grid header and types a few characters. This filters the
grid values. The group counts update as well.

Editing
-------

Jess is an editor of content in the project. When she visits the grid,
certain aspects are enabled which are disabled for others:

- *Add*. Tap a "+" icon in the grid footer. A popup menu appears with
  the list of possible things to add. A popup appears with a form.
  After successful adding, the grid is scrolled to that row.

- *Edit*. Double-tap a cell (whether the row is selected or not) to get
  a SlickGrid editor for that field.

- *Delete/Duplicate/Up/Down/Re-group/Move row*. Tap-and-hold a
  row (whether selected or not) gives a popup menu with various row
  operations.

  The Up/Down icons appears when the grid is orderable (see below).
  They let you keep tapping repeatedly to move a row around

  The Regroup popup menu item appears when the grid is grouped. This
  lets you send the row to a new group. Tap the menu item and you get a
  list of the current groups. Tap the item in the list and the row is
  moved and the popup disappears.

  Move appears in systems with multiple "folders" (or containers.)

- *Bulk Operations*. Tap an "Edit" icon in the grid footer to go into
  "Edit" mode. This adds a column on the far left with a check box. The
   checkbox is also a drag handle.) With this, you can can select
   multiple items and then perform a group operation with a tap-and-hold.

   Group operations include all the row operations.

- *Ordering*. In some cases you would like ordering. When any of the
  columns are sorted, there obviously is no ordering possible. So there
  needs to be either a way to get into the Ordered/Ordering View,
  or out of Sorted View.

  Then, we can allow ordering on single items or bulk items. This
  requires some consideration: can you move 5 non-contiguous items in a
  range? For large data sets, you might need an popup on the selection
  to move to the top/bottom, or directly to a group.

Developer
---------

In theory we can do like other iPad apps and allow new fields to be
added via the app, etc.