(function () {
  const carousel = document.querySelector('[data-news-carousel]');
  const archive = document.querySelector('[data-news-archive]');
  const storiesSection = document.querySelector('[data-news-stories]');
  const storyDialog = document.querySelector('[data-story-dialog]');
  const storyContent = document.querySelector('[data-story-content]');
  const imageDialog = document.querySelector('[data-image-dialog]');
  const enlargedImage = document.querySelector('[data-enlarged-image]');
  const imageCaption = document.querySelector('[data-image-caption]');

  if (!carousel || !archive || !storiesSection || !storyDialog || !storyContent || !imageDialog || !enlargedImage || !imageCaption) return;

  const posts = [...storiesSection.querySelectorAll('.news-post')];
  const getPostInfo = (post) => {
    const body = post.querySelector('.project-card-body');
    const title = body?.querySelector('h3');
    const date = body?.querySelector('.muted');
    const excerpt = [...(body?.querySelectorAll('p') || [])]
      .find((paragraph) => !paragraph.classList.contains('muted'));
    const image = post.querySelector('.post-gallery img');
    if (!body || !title || !image) return null;
    return {
      title: title.textContent.trim(),
      date: date?.textContent.trim() || '',
      excerpt: excerpt?.textContent.trim() || '',
      image
    };
  };
  const validPosts = posts.map((post) => ({ post, info: getPostInfo(post) })).filter((entry) => entry.info);
  if (!validPosts.length) return;

  const createPhotoButton = (image, className) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `news-photo-button${className ? ` ${className}` : ''}`;
    button.setAttribute('aria-label', `Enlarge photo: ${image.alt}`);
    button.append(image.cloneNode(true));
    return button;
  };

  const initializePhotoCarousel = (gallery) => {
    const photos = [...gallery.querySelectorAll('.news-photo-button')];
    if (photos.length < 2) return;

    gallery.classList.add('news-photo-carousel');
    photos.forEach((photo, index) => {
      photo.classList.add('news-story-photo');
      photo.hidden = index !== 0;
    });

    let activeIndex = 0;
    const indicators = document.createElement('div');
    indicators.className = 'news-photo-indicators';
    const dots = photos.map((photo, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'news-photo-dot';
      dot.setAttribute('aria-label', `Show photo ${index + 1} of ${photos.length}`);
      dot.setAttribute('aria-current', String(index === 0));
      dot.addEventListener('click', () => showPhoto(index));
      indicators.append(dot);
      return dot;
    });

    const showPhoto = (index) => {
      activeIndex = (index + photos.length) % photos.length;
      photos.forEach((photo, photoIndex) => {
        photo.hidden = photoIndex !== activeIndex;
        dots[photoIndex].setAttribute('aria-current', String(photoIndex === activeIndex));
      });
    };

    const controls = document.createElement('div');
    controls.className = 'news-photo-controls';
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'news-photo-arrow';
    previous.setAttribute('aria-label', 'Show previous photo');
    previous.textContent = '‹';
    previous.addEventListener('click', () => showPhoto(activeIndex - 1));

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'news-photo-arrow';
    next.setAttribute('aria-label', 'Show next photo');
    next.textContent = '›';
    next.addEventListener('click', () => showPhoto(activeIndex + 1));
    controls.append(previous, indicators, next);
    gallery.after(controls);

    let touchStartX = null;
    let suppressPhotoClick = false;
    let suppressClickTimeout;
    gallery.addEventListener('click', (event) => {
      if (!suppressPhotoClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressPhotoClick = false;
    }, true);
    gallery.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') touchStartX = event.clientX;
    });
    gallery.addEventListener('pointerup', (event) => {
      if (touchStartX === null) return;
      const distance = event.clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) > 45) {
        showPhoto(activeIndex + (distance < 0 ? 1 : -1));
        suppressPhotoClick = true;
        clearTimeout(suppressClickTimeout);
        suppressClickTimeout = setTimeout(() => {
          suppressPhotoClick = false;
        }, 500);
      }
    });
    gallery.addEventListener('pointercancel', () => {
      touchStartX = null;
    });
  };

  const openStory = (post) => {
    const detail = post.cloneNode(true);
    detail.removeAttribute('id');
    detail.classList.remove('card', 'project-card');
    detail.classList.add('news-post-detail');
    detail.querySelectorAll('.post-gallery').forEach((gallery) => {
      gallery.querySelectorAll('img').forEach((image) => image.replaceWith(createPhotoButton(image)));
      initializePhotoCarousel(gallery);
    });
    const title = detail.querySelector('h3');
    if (title) {
      title.id = 'story-dialog-title';
      storyDialog.setAttribute('aria-labelledby', title.id);
    }
    storyContent.replaceChildren(detail);
    storyDialog.showModal();
  };

  const openImage = (image) => {
    enlargedImage.src = image.currentSrc || image.src;
    enlargedImage.alt = image.alt;
    imageCaption.textContent = image.alt;
    imageDialog.showModal();
  };

  const slides = [];
  const dots = [];
  const showSlide = (index) => {
    const activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.hidden = !active;
      dots[slideIndex].setAttribute('aria-current', String(active));
    });
  };

  validPosts.forEach(({ post, info }, index) => {
    const slide = document.createElement('article');
    slide.className = 'news-feature-slide';
    slide.hidden = index !== 0;

    const photo = createPhotoButton(info.image, 'news-feature-image');
    slide.append(photo);

    const body = document.createElement('div');
    body.className = 'news-feature-body';
    if (info.date) {
      const date = document.createElement('p');
      date.className = 'muted';
      date.textContent = info.date;
      body.append(date);
    }
    const heading = document.createElement('h3');
    heading.textContent = info.title;
    body.append(heading);
    const excerpt = document.createElement('p');
    excerpt.className = 'news-feature-excerpt';
    excerpt.textContent = info.excerpt;
    body.append(excerpt);
    const readStory = document.createElement('button');
    readStory.type = 'button';
    readStory.className = 'button news-read-button';
    readStory.textContent = 'Read full story';
    readStory.addEventListener('click', () => openStory(post));
    body.append(readStory);
    slide.append(body);
    slides.push(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'news-carousel-dot';
    dot.setAttribute('aria-label', `Show featured news: ${info.title}`);
    dot.setAttribute('aria-current', String(index === 0));
    dot.addEventListener('click', () => showSlide(index));
    dots.push(dot);

    if (index > 0) {
      const card = document.createElement('article');
      card.className = 'card news-archive-card';
      card.append(createPhotoButton(info.image, 'news-archive-image'));

      const cardBody = document.createElement('div');
      cardBody.className = 'news-archive-body';
      if (info.date) {
        const date = document.createElement('p');
        date.className = 'muted';
        date.textContent = info.date;
        cardBody.append(date);
      }
      const cardHeading = document.createElement('h3');
      const titleButton = document.createElement('button');
      titleButton.type = 'button';
      titleButton.className = 'news-title-button';
      titleButton.textContent = info.title;
      titleButton.addEventListener('click', () => openStory(post));
      cardHeading.append(titleButton);
      cardBody.append(cardHeading);
      const cardExcerpt = document.createElement('p');
      cardExcerpt.className = 'news-card-excerpt';
      cardExcerpt.textContent = info.excerpt;
      cardBody.append(cardExcerpt);
      const readButton = document.createElement('button');
      readButton.type = 'button';
      readButton.className = 'news-card-link';
      readButton.textContent = 'Read story';
      readButton.addEventListener('click', () => openStory(post));
      cardBody.append(readButton);
      card.append(cardBody);
      archive.append(card);
    }
  });

  const controls = document.createElement('div');
  controls.className = 'news-carousel-controls';
  if (slides.length > 1) {
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'news-carousel-arrow';
    previous.setAttribute('aria-label', 'Show previous featured news');
    previous.textContent = '‹';
    previous.addEventListener('click', () => showSlide(slides.findIndex((slide) => !slide.hidden) - 1));

    const indicators = document.createElement('div');
    indicators.className = 'news-carousel-dots';
    dots.forEach((dot) => indicators.append(dot));

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'news-carousel-arrow';
    next.setAttribute('aria-label', 'Show next featured news');
    next.textContent = '›';
    next.addEventListener('click', () => showSlide(slides.findIndex((slide) => !slide.hidden) + 1));
    controls.append(previous, indicators, next);
  }
  carousel.replaceChildren(...slides, controls);
  storiesSection.hidden = true;

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const photoButton = event.target.closest('.news-photo-button');
    const image = photoButton?.querySelector('img');
    if (image) openImage(image);
  });

  document.querySelector('[data-close-story]')?.addEventListener('click', () => storyDialog.close());
  document.querySelector('[data-close-image]')?.addEventListener('click', () => imageDialog.close());
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (imageDialog.open) {
      event.preventDefault();
      imageDialog.close();
    } else if (storyDialog.open) {
      event.preventDefault();
      storyDialog.close();
    }
  });
  [storyDialog, imageDialog].forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
})();
