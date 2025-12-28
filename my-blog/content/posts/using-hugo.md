+++
date = '2025-12-27T19:55:33+05:30'
draft = false
title = 'Blogging using Hugo'
+++

## Background
I recently started using Hugo, a fast and flexible static site generator, to publish the blog you're reading. I've captured some useful commands in this post to serve as a quick reference for myself and others getting started with Hugo.

## Installing Hugo
On Linux, enter the command below to install Hugo.
```bash
sudo snap install hugo
```

## Creating your blog
Create the blog and initialize it as a git repository using the commands below. I use git to version control the changes to my blog and upload it to GitHub to back it up. Git makes it easy to experiment and go back to the last known good version if things break.
```bash
hugo new site my-blog
cd my-blog
git init
```
Create a new git commit now so that you can always revert to this clean state, especially before installing a theme. This makes it easier to understand how themes work by experimenting without fear of breaking things.

## Installing a theme
I'm using the Sans theme. You can view a demo on the [Hugo Themes site](https://themes.gohugo.io/themes/sans/) and find installation instructions on [GitHub](https://github.com/psugam/sans).

If you add the theme as a submodule, then remember to also clone it using the command below after cloning the main repo on a different machine (say, if you work on your blog from your desktop and laptop) else you will get errors when you run Hugo.
```bash
git submodule update --init --recursive
```

## Creating a new post
Enter the command below to create a new post which you can then edit in any editor.
```bash
hugo new content/posts/blog-post-title.md
```

This is the base text added by Hugo in the file.
```toml
+++
date = '2024-12-27T19:55:33+05:30'
draft = true
title = 'Using Hugo'
+++
```

Set **draft=false** and run the command below to see the edits you make in the markdown file in realtime (on save).
```bash
hugo server
```

If you like to compose multiple posts in one go but only publish one at a time then run the command below to see draft posts locally.
```bash
hugo server -D
```

## Publishing your post
This entails building your entire site which will publish the non-draft posts to the public folder. Run the command below in the root directory of the blog.
```bash
hugo
```
**Note:** Make sure `draft = false` in your post's front matter before building, otherwise the post won't be included in the build output.

Copy the contents of the public folder to your web server (nginx, AWS S3 bucket, etc.) every time you publish a new post.

I will create a post on how I serve my blog using nginx and the build output in the `public` directory soon. Until then, happy blogging!

## References
1. Check out the [Markdown Guide](https://www.markdownguide.org/basic-syntax/) to learn basic Markdown syntax.
2. See Hugo's [Getting Started](https://gohugo.io/getting-started/usage/) guide for more information.
