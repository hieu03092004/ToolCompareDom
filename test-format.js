const beautify = require('js-beautify').html;

function formatHTML(html) {
  return beautify(html, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 1,
    preserve_newlines: true,
    wrap_line_length: 0,
    indent_inner_html: true
  });
}

// Test với data của bạn
const rawHTML = `<div class="wrapper">        <div class="row">            <div class="inner">                <h1>Face</h1>                                <ul class="partial_breadcrumb" data-s3-partial="">                <li><a href="/" role="link" aria-label="Breadcrumbs to help navigate the user">Home</a></li>                                                                    <li><a href="/face/" role="link" aria-label="Breadcrumbs to help navigate the user">Face</a></li>                        </ul>                                                    <div class="text"><p>Patients are often dismayed to find that following a weight loss surgery or extensive weight loss, even with significant weight gone, they are still not completely satisfied with their appearance.</p></div>                                                            </div>        </div>                    <div class="media">                                    <picture class="background">  <source media="(max-width:420px)" srcset="https://www.datocms-assets.com/60131/1643146856-face-banner.jpg?auto=format,compress&amp;w=420">  <img src="banner.jpg" alt="woman caressing face"></picture>                            </div>            </div>`;

console.log('=== BEFORE FORMAT ===');
console.log(rawHTML);

console.log('\n=== AFTER FORMAT ===');
console.log(formatHTML(rawHTML)); 