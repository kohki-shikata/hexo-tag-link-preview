/**
* hexo-tag-link-preview
* https://github.com/superalsrk/hexo-pdf.git
* Copyright (c) 2018, minamo
* Licensed under the MIT license.
* Syntax:
* {% linkPreview https://www.amazon.com/ %}
**/

'use strict';
const util = require('hexo-util');
const ogs = require('open-graph-scraper');
const meta = require('meta-scraper');
const descriptionLength = (hexo.config.linkPreview && hexo.config.linkPreview.descriptionLength)
                            ? hexo.config.linkPreview.descriptionLength : 140;
const className = (hexo.config.linkPreview && hexo.config.linkPreview.className)
                    ? hexo.config.linkPreview.className : 'link-preview';

hexo.extend.tag.register('linkPreview', function(args) {
  return getTag({url: args[0], target: args[1], rel: args[2]}).then(tag => {
    return tag;
  });
}, {async: true});

hexo.extend.tag.register('linkPreviewAmazon', function(args) {
  return getTag({url: args[0], target: args[1], rel: args[2]}).then(tag => {
    return tag;
  });
}, {async: true});

async function getTag(options) {
  return ogs(options)
    .then(function (result) {
      const ogp = result.data;
      let image = '';
      let descriptions = '';

      if (ogp.hasOwnProperty('ogImage') && ogp.ogImage.url !== '/img/ogp.png') {
        image += util.htmlTag('img', { src: ogp.ogImage.url } , '');
        image = util.htmlTag('div', { class: 'og-image'}, image)
      }

      descriptions += util.htmlTag('div', { class: 'og-title' }, ogp.ogTitle);

      if (ogp.hasOwnProperty('ogDescription')) {
        const description = adjustLength(ogp.ogDescription);
        descriptions += util.htmlTag('div', { class: 'og-description' }, description);
      }

      descriptions = util.htmlTag('div', { class: 'descriptions' }, descriptions);

      const tag = util.htmlTag('div', { class: 'link-area' },  image + descriptions);

      return util.htmlTag('a', { href: 'https://www.amazon.co.jp/gp/product/' + args[0], class: className, target: options.target, rel: options.rel }, tag);
    })
    .catch(function (error) {
      console.log('error:', error);
      return '';
  });
}

async function getAmazon(options) {
  return ogs(options)
    .then(function (result) {
      const metadata = meta.allTags;
      let image = '';
      let descriptions = '';

      image += util.htmlTag('img', { src: 'http://images-jp.amazon.com/images/P' + args[0] + '.09.LZZZZZZZ' } , '');
      image = util.htmlTag('div', { class: 'og-image'}, image)

      descriptions += util.htmlTag('div', { class: 'og-title' }, ogp.ogTitle);

      if (metadata.description) {
        const description = adjustLength(metadata.description);
        descriptions += util.htmlTag('div', { class: 'og-description' }, description);
      }

      descriptions = util.htmlTag('div', { class: 'descriptions' }, descriptions);

      const tag = util.htmlTag('div', { class: 'link-area' },  image + descriptions);

      return util.htmlTag('a', { href: options.url, class: className, target: options.target, rel: options.rel }, tag);
    })
    .catch(function (error) {
      console.log('error:', error);
      return '';
  });
}

function adjustLength(description) {
  if (description && description.length > descriptionLength) {
    description = description.slice(0, descriptionLength) + '…';
  }
  return description;
}
