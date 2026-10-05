(function () {
  const section = document.querySelector('.latest-news');
  const preview = document.getElementById('latest-news-preview');
  if (!section || !preview) return;

  const newsUrl = new URL('news/', document.baseURI);

  fetch(newsUrl, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`News page returned ${response.status}`);
      return response.text();
    })
    .then((markup) => {
      const newsDocument = new DOMParser().parseFromString(markup, 'text/html');
      const post = newsDocument.querySelector('.news-post');
      const postBody = post?.querySelector('.project-card-body');
      const title = postBody?.querySelector('h3');
      if (!postBody || !title) return;

      const description = [...postBody.querySelectorAll('p')]
        .find((paragraph) => !paragraph.classList.contains('muted'));
      const image = post.querySelector('.post-gallery img');
      const postLink = document.createElement('a');
      postLink.href = newsUrl.href;

      const card = document.createElement('article');
      card.className = 'card latest-news-preview';

      if (image) {
        const imageLink = postLink.cloneNode();
        imageLink.className = 'latest-news-image';
        const previewImage = document.createElement('img');
        previewImage.src = new URL(image.getAttribute('src'), newsUrl).href;
        previewImage.alt = image.alt;
        imageLink.append(previewImage);
        card.append(imageLink);
      }

      const body = document.createElement('div');
      body.className = 'latest-news-body';

      const date = postBody.querySelector('.muted');
      if (date) {
        const datePreview = document.createElement('p');
        datePreview.className = 'muted';
        datePreview.textContent = date.textContent.trim();
        body.append(datePreview);
      }

      const heading = document.createElement('h3');
      const titleLink = postLink.cloneNode();
      titleLink.textContent = title.textContent.trim();
      heading.append(titleLink);
      body.append(heading);

      if (description) {
        const excerpt = document.createElement('p');
        excerpt.className = 'latest-news-excerpt';
        excerpt.textContent = description.textContent.trim();
        body.append(excerpt);
      }

      card.append(body);
      preview.replaceChildren(card);
      section.hidden = false;
    })
    .catch((error) => {
      console.error('Unable to load the latest news preview.', error);
    });
})();