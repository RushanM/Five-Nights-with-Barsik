// Скрипт для замены русской локализации интерфейса вики на предпочтительную
$(function() {
    // ====== 1. Замена «Заглавная» на «Главная» ======
    function replaceMainPageTitle() {
        var $title = $('.page-header__title#firstHeading');
        if ($title.length && $title.text().trim() === 'Заглавная') {
            $title.text('Главная');
        }
    }
    // Вызываем при загрузке
    replaceMainPageTitle();

    // ====== 2. Замена текста в кнопке «Править профайл» и навигационных ссылках ======
    function replaceTexts() {
        var $button = $('.user-identity-header__button');
        var $navLinks = $('.user-profile-navigation__link a');

        // Замена «Править профайл» на «Обновить информацию»
        if ($button.length) {
            if ($button.text().trim() === 'Править профайл') {
                $button.text('Обновить информацию');
            }
        }

        // Замена «Стена обсуждения» на «Стена» и «Блог» на «Записи в блоге»
        if ($navLinks.length) {
            $navLinks.each(function() {
                var $this = $(this);
                var linkText = $this.text().trim();

                if (linkText === 'Стена обсуждения') {
                    $this.text('Стена');
                } else if (linkText === 'Блог') {
                    $this.text('Записи в блоге');
                }
            });
        }

        // Останавливаем интервал, когда элементы найдены
        if ($button.length && $navLinks.length) {
            clearInterval(intervalId);
        }
    }

    // Запускаем интервал, чтобы дождаться загрузки элементов
    var intervalId = setInterval(replaceTexts, 50);

    // ====== 3. Единовременная замена текста в #mw-clearyourcache (не через Observer) ======
    function replaceClearCacheText() {
        var $cacheBlock = $('#mw-clearyourcache');
        if ($cacheBlock.length) {
            // Параграф с «Замечание:» 
            $cacheBlock.find('p').each(function() {
                var $p = $(this);
                var text = $p.html();
                if (text && text.includes('Возможно, после публикации вам придётся очистить кэш')) {
                    // Заменяем нужную часть строки
                    var newText = text.replace(
                        'Возможно, после публикации вам придётся очистить кэш своего браузера, чтобы увидеть изменения.',
                        'возможно после публикации вам придётся очистить кэш своего браузера, чтобы увидеть изменения.'
                    );
                    $p.html(newText);
                }
            });

            // Список с инструкциями
            $cacheBlock.find('li').each(function() {
                var $li = $(this);
                var html = $li.html();

                if (!html) return;

                // Firefox/Safari
                if (html.includes('<strong>Firefox / Safari:</strong>')) {
                    var newHtml = html
                        .replace('Firefox / Safari:', 'Firefox/Safari:')
                        .replace('Удерживая клавишу <em>Shift</em>, нажмите на панели инструментов <em>Обновить</em> либо нажмите <em>Ctrl+F5</em> или <em>Ctrl+R</em> (<em>⌘+R</em> на Mac)',
                                 'удерживая клавишу <em>Shift</em>, нажмите на панели инструментов <em>Обновить</em>, либо нажмите <em>Ctrl + F5</em> или <em>Ctrl + R</em> (<em>⌘ + R</em> на Mac);');
                    $li.html(newHtml);
                }

                // Google Chrome
                if (html.includes('<strong>Google Chrome:</strong>')) {
                    var newHtml = html
                        .replace('Нажмите <em>Ctrl+Shift+R</em> (<em>⌘+Shift+R</em> на Mac)', 'нажмите <em>Ctrl + Shift + R</em> (<em>⌘ + Shift + R</em> на Mac);');
                    $li.html(newHtml);
                }

                // Internet Explorer/Edge
                if (html.includes('<strong>Internet Explorer / Edge:</strong>')) {
                    var newHtml = html
                        .replace('Удерживая <em>Ctrl</em>, нажмите <em>Обновить</em> либо нажмите <em>Ctrl+F5</em>',
                                 'удерживая <em>Ctrl</em>, нажмите <em>Обновить</em>, либо нажмите <em>Ctrl + F5</em>;')
                        .replace('Internet Explorer / Edge:', 'Internet Explorer/Edge:');
                    $li.html(newHtml);
                }

                // Opera
                if (html.includes('<strong>Opera:</strong>')) {
                    var newHtml = html
                        .replace('Нажмите <em>Ctrl+F5</em>', 'нажмите <em>Ctrl + F5</em>');
                    $li.html(newHtml);
                }
            });
        }
    }

    replaceClearCacheText();

    // ====== 4. Замена текста в блоке «.blog-listing.is-empty» ======
    function replaceBlogListingText() {
        var $blogListing = $('.blog-listing.is-empty');
        if ($blogListing.length) {
            var $paragraphs = $blogListing.find('p');
            $paragraphs.each(function() {
                var $p = $(this);
                var fullText = $p.text().trim();
                // Ищем строку, где упоминается, что можно писать блоги
                if (fullText.includes('Вы можете писать блоги на вики')) {
                    // Создаём новое содержимое
                    var newText = 'Вы можете писать записи, которые попадут в ';
                    var $link = $('<a>')
                        .attr('href', '/wiki/Blog:Recent_posts')
                        .text('блог вики');
                    var afterLinkText = '.';

                    // Очищаем параграф и добавляем новое содержимое
                    $p.empty()
                        .append(newText)
                        .append($link)
                        .append(afterLinkText);
                }
            });
            return true;
        }
        return false;
    }

    // ====== MutationObserver для слежения за динамическими изменениями (как в блоге) ======
    var observer = new MutationObserver(function(mutations, obs) {
        var replacedBlog = replaceBlogListingText();
        if (replacedBlog) {
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
