$(document).ready(function () {
  let productImageGroups = []
  $('.img-fluid').each(function () {
    let productImageSource = $(this).attr('src')
    let productImageTag = $(this).attr('tag')
    let productImageTitle = $(this).attr('title')
    if (productImageTitle) {
      productImageTitle = 'title=" xxxx 01 ' + productImageTitle + '" '
    }
    else {
      productImageTitle = productImageSource
    }
    $(this).
        wrap('<a class="boxedThumb ' + productImageTag + '" ' +
            productImageTitle + 'href="' + productImageSource + '"></a>')
    productImageGroups.push('.' + productImageTag)
  })
  jQuery.unique(productImageGroups)
  productImageGroups.forEach(productImageGroupsSet)

  function productImageGroupsSet (value) {
    $(value).simpleLightbox()
    /**
     * $(value).lightbox()
    * */
  }
})


// data-lightbox="image-1"
