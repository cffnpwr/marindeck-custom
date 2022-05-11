const renderCard = (title, domain, linkURL, imgURL, cardType, html) => {
    const dom = document.createElement('div');
    dom.innerHTML = html;
    const cardContainer = dom.firstElementChild;

    // カード全体
    const linkCard = document.createElement('div');
    linkCard.classList.add('link-card');
    linkCard.setAttribute('data-testid', 'card');

    // a tag リンク用
    const a = document.createElement('a');
    a.setAttribute('href', linkURL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'url noopener noreferrer');
    a.style.setProperty('text-decoration', 'none');
    a.style.setProperty('display', 'block');

    // img tag カード画像用
    let cardImg;
    if (imgURL !== '') {
        cardImg = document.createElement('img');
        cardImg.src = imgURL;
    } else {
        cardImg = document.createElement('div');
        // twitter cardによって変更
        if (cardType === 'summary')
            cardImg.classList.add('card-img-icon-sm');
        else
            cardImg.classList.add('card-img-icon');

        cardImg.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="img-icon"><g><path d="M14 11.25H6c-.414 0-.75.336-.75.75s.336.75.75.75h8c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm0-4H6c-.414 0-.75.336-.75.75s.336.75.75.75h8c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm-3.25 8H6c-.414 0-.75.336-.75.75s.336.75.75.75h4.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path><path d="M21.5 11.25h-3.25v-7C18.25 3.01 17.24 2 16 2H4C2.76 2 1.75 3.01 1.75 4.25v15.5C1.75 20.99 2.76 22 4 22h15.5c1.517 0 2.75-1.233 2.75-2.75V12c0-.414-.336-.75-.75-.75zm-18.25 8.5V4.25c0-.413.337-.75.75-.75h12c.413 0 .75.337.75.75v15c0 .452.12.873.315 1.25H4c-.413 0-.75-.337-.75-.75zm16.25.75c-.69 0-1.25-.56-1.25-1.25v-6.5h2.5v6.5c0 .69-.56 1.25-1.25 1.25z"></path></g></svg>';
    }

    // カードのテキスト部分
    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    // div tag リンク先タイトル用
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    linkTitle.innerText = title;

    // div tag リンク先ドメイン用
    const linkDomain = document.createElement('div');
    linkDomain.classList.add('link-domain');
    linkDomain.innerHTML = '<svg viewBox="0 0 24 24" class="link-icon"><g><path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path><path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path></g></svg>' + domain;

    // twitter cardによって変更
    if (cardType === 'summary') {
        cardImg.classList.add('card-img-sm');
        a.classList.add('sm');
        cardText.classList.add('card-text-sm');
    } else {
        cardImg.classList.add('card-img');
    }

    // 組み立て
    cardText.appendChild(linkTitle);
    cardText.appendChild(linkDomain);

    a.appendChild(cardImg);
    a.appendChild(cardText);

    linkCard.appendChild(a);

    cardContainer.querySelector('.js-card-container').parentNode.insertBefore(linkCard, cardContainer.querySelector('.js-card-container'));

    return cardContainer.outerHTML;
};

const renderCardFromTweetStatus = (ts, html) => {
    const card = ts.card || (ts.targetTweet ? ts.targetTweet.card : undefined);
    if (card !== undefined && (card.name === 'summary' || card.name === 'summary_large_image' || card.name === 'player')) {
        const value = card.binding_values;
        const cardType = card.name;
        const title = value.title.string_value;
        const domain = value.domain.string_value;
        let image = '';
        if (value.player_image !== undefined || value.thumbnail_image !== undefined)
            image = cardType === 'player' ? value.player_image_original.image_value.url : value.thumbnail_image_original.image_value.url;

        return renderCard(title, domain, card.url, image, cardType, html);
    } else
        return html;
};

TD.ui.Column.prototype.renderChirps = function (e, t) {
    var i, n, s, r, o = [];
    for (n = 0; n < e.length; n++) {
        r = (s = e[n]).getMainUser && s.getMainUser().isProtected;
        try {
            i = s.render({
                isTemporaryColumn: t.isTemporaryColumn,
                mediaPreviewSize: t.mediaPreviewSize,
                isMinimalist: t.doRenderMinimalist,
                withShowVerified: t.showVerifiedBadge,
                withRemove: t.isOwnCustomTimeline,
                withDragHandle: true
            });

            const article = renderCardFromTweetStatus(s, i);

            o.push(article);
        } catch (e) {
            TD.util.metric("column:ui:chirp-render:error");
            // console.log(e);
        }
    }

    return o.join("");
};

TD.components.TweetDetailView.prototype._showMediaOrCardsForChirp = function (e) {
    if (e.hasMedia())
        this._showMedia(e)

    else {
        this.$tweetDetail[0].innerHTML = renderCardFromTweetStatus(e, this.$tweetDetail[0].innerHTML);
        e.card = undefined;
        this._showCardsForChirp(e);
    }
};