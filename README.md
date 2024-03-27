# Test Labs

Your playground on automation testing tools.

## Pages

- [Welcome](#welcome)
- [Registration](#registration)
- [Login](#login)
- [Home](#home)
- [Posts](#posts)
- [Comments](#comments)
- [Accounts](#accounts)

### Welcome

**Route**: `/`

UI elements:

- **Log In** - redirect to `/login`
- **Get Started** - redirect to `/register`
- **Enable/Disable** - toggle **Persist** feature on / off
- **Clear all** - delete all data

### Registration

**Route**: `/register`

- **Log In** - redirect to `/login`
- **{x} users registered** - text description for number of registered users
- **register cards** - each redirects to `/user/{id}/profile`

#### Registration Form

##### First name

**Required**.

Must contain alpha characters only

##### Last name

Must contain alpha characters only

##### Username

**Required**.

Must contain alphanumeric or underscore "\_" characters only

---

**WHEN** `first name` and `last name` is changed

**THEN** automatically updates `username` with following format: `{firstname}_{lastname}`

Underscore `_` will come in between firstname and lastname

---

**WHEN** `first name` is blank **AND** `last name` exists

**THEN** automatically updates `username` to match `last name`

---

**WHEN** `last name` exists **AND** `last name` is blank

**THEN** automatically updates `username` to match `first name`

---

##### Password

**Required**

- Must contain lowercase character
- Must contain uppercase character
- Must contain number
- Must contain special character
- Must contain space
- String must contain at least 8 character(s)

##### Confirm Password

**Required**

Must match password

##### Submit button

Enables only when fields contain valid input. Otherwise, disabled.

Successful registration redirects to `/login?u={username}`

> **Registration fails on submit when username is already taken.**

### Login

**Route**: `/login`

| Search     | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| `u`        | value will fill the username field and auto-focus on password field |
| `redirect` | successful login will redirect to the given value                   |

Examples:

- `/login?u=test` - will automatically fill username field with `test`
- `/login?redirect=%2Fuser%2F{id}%2Fprofile` - will redirect to `/user/{id}/profile` on successful login
- `/login?redirect=%2Fuser%2F{id}%2Fprofile&u=test`

`%2F` is the URL encoded value of the forward slash (`/`)

---

**WHEN** `redirect` is not specified,

**THEN** by default, successful login will redirect to `/home`

---

**WHEN** there are users already registered

**THEN** a list of `avatar` of users should display

**AND** clicking on `avatar` should update the search `u` and `username` field with values

**THEN** focus on password field

**AND** any existing search params such as `register` should not disappear

---

**GIVEN** user is successfully logged in

**WHEN** user clicks on the **app title** `Test Labs` on the top left corner

**THEN** user should be redirected to `/home`, else redirect to `/`

---

**GIVEN** user is already logged in

**WHEN** user visits `/login` or `/register` page

**THEN** user will be redirected to `/home`

---

`Create Account` - redirects to `/register`

### Home

**Route**: `/home`

#### Left Aside section

- **User Avatar**
- **username** with `@` symbol prefix
- **counters** such as number of **posts**, **appreciations** and **saved**
  - formula:
    - **posts** = simply the total number of user's post
    - **appreciation** = likes received by the user (post likes + comment likes + reply likes)
      - self count excluded
    - **saved** = total posts bookmarked/saved by the user

The following items are similar to the **menu items** on the `app header` when the `user avatar` is clicked

- **Account Profile** - redirect to `/user/{id}/profile`
- **My Posts** - redirect to `/user/{id}/profile?tab=posts`
- **Saved** - redirect to `/user/{id}/profile?tab=saved`
- **Logout** - redirect to `/login`

#### Right Aside section

- **Timezone utility** - external app outside `Test Labs`
- **Recent activities** - displays at most 10 recent activities such as user commenting, creating a post etc.

#### Main section (middle)

The list of `ALL` users' post.

#### Floating Write a Post

- Should be displayed by default or when scrolling up
- Should be hidden when scrolling down
- Clicking it should display the `Write a post` modal

#### Write a post modal

- **Textarea** input - **Required**. The post "content" with max of 300 characters
  - hint should be updated to subtract the content length from 300
- **Example** button - should fill the content with random examples
- **Clear** button - will only display when content has value.
  - Clicking it should clear the content
- **Submit post** - will only be enabled with all valid input
  - Submitting a post with `joke` as the only content should call an **external API** and post a random joke as the content of the post.
  - Successful post should prepend or add the post at the very top of the list in home.

### Posts

Located in routes:

- `/home`
- `/user/{id}/profile?tab=posts`
- `/user/{id}/profile?tab=saved`

Post card consist of:

#### Head

- **Author Avatar** - clicking on it should redirect to the author's account profile (`/user/{id}/profile`)
- **Author's username**
- **Time ago** - (e.g. 5 minutes ago) **should** display date instead when more than a week old
- **Menu button** - (**ellipsis** / triple dots in horizontal)
  - Edit - should display a modal to edit the post
  - Delete - should delete the post permanently

#### Body

Consists of the post content.

**GIVEN** valid Image URL

**WHEN** format `img:<url>` or `image:<url>` exists in the text

**THEN** it should display the image in post content

**AND** remaining text/caption should go below the image

#### Footer

- **number of likes** - clicking it should display a modal of users liked the post
- **number of comments** - clicking it should display the comments modal
- **Like** - (heart icon) clicking it should toggle like/unlike to a post
- **Comment** - (chat icon) clicking it should display the comments modal
- **Save** - (bookmark icon) clicking it should toggle save/unsave post

> Modal - is a popup that disables other pages (i.e. you can't scroll the content beneath the modal)

### Comments

Each **post** cards has its own comment and reply section.

**Comment vs Reply** - **comment** is the parent thread, and **reply** is the child comment.
Replying to a "reply" will be added to the parent thread. In other words,
the max level nested for comments is only up to two (`2`) levels deep. 1 is parent. 2 is child.

Parts of comment:

- **Author Avatar**
- **Author username**
- **Time ago** - i.e. 5 minutes ago (should display date instead when comment is over a week old)
- **Comment like** - (heart icon)
- **Comment num of likes** - clicking on it should display **likes** modal of the user's liked the comment
- **Reply** - clicking on it will focus on the **add comment** field and display a `Replying to...`
  - **Replying to...** - indicates the the comment to be submitted is a reply or a child comment
    - Clicking on it removes the indicator and change back to parent comment.
- **Delete** - hide a comment (soft delete)
- **Undo** - undo a deleted comment
  - should only be displayed when the comment is deleted

#### Add comment form

- **User Avatar**
- **Add comment** field (max 100 characters)
- **Submit button** submits the form (can also just press Enter key to submit)

> **User vs Author**

- User = logged in user
- Author = user who owned the post/comment

---

**GIVEN** replying to (indicator) does not exist

**WHEN** comment is submitted

**THEN** comment is treated as parent comment and will be added on top of all other parent comments.

---

**GIVEN** replying to (indicator) exists

**WHEN** comment is submitted

**THEN** comment is treated as child comment (reply) and will be added below the parent comment
and below all other child comments or siblings.

### Accounts

Routes:

- `/user/{id}/profile`
- `/user/{id}/profile?tab=posts`
- `/user/{id}/profile?tab=saved`

---

**WHEN** logged in user owns the account,

**THEN** allow access to all routes

**WHEN** accessing route `/user/{id}/profile`

**THEN** display **Basic Information** and **Password and authentication** sections

Profile description is max of **30** characters only. The other fields should be self-explanatory.

---

**WHEN** logged in user is a visitor (**OR** user is not logged in at all)

**THEN** allow access only on the following route: `/user/{id}/profile?tab=posts`

**AND** when user attempts to access other routes,

**THEN** should redirect to `/user/{id}/profile?tab=posts`

---

**GIVEN** user is NOT logged in

**THEN** should display "**Login Required**"

**AND** posts should never be displayed
