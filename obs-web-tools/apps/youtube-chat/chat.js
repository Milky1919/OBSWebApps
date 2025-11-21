document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const container = document.getElementById('chat-container');

    // Configuration
    const config = {
        id: params.get('id') || '',
        maxlines: parseInt(params.get('maxlines')) || 10,
        flow: params.get('flow') || 'bottom-up', // bottom-up, top-down
        showname: params.get('showname') !== 'off',
        showavatar: params.get('showavatar') !== 'off',
        theme: params.get('theme') || 'neon-blue',
        font: params.get('font') || 'Segoe UI',
        fontsize: params.get('fontsize') || '16px',
        namefontsize: params.get('namefontsize') || '0.9em',
        maxwidth: params.get('maxwidth') || '100%',
        padding: params.get('padding') || '10px',
        textcolor: params.get('textcolor') || '#ffffff',
        inanim: params.get('inanim') || 'fade-in',
        outanim: params.get('outanim') || 'fade-out',
        animspeed: params.get('animspeed') || '0.5s',
        easing: params.get('easing') || 'ease-out',
        exclude: (params.get('exclude') || '').split(',').map(s => s.trim()).filter(s => s),
        scHighlight: params.get('sc-highlight') === 'on',
        showmember: params.get('showmember') || 'all', // all, off, member-only
        mode: params.get('mode') || 'normal' // normal, preview
    };

    // Apply global styles
    document.body.style.fontFamily = config.font;
    container.style.justifyContent = config.flow === 'top-down' ? 'flex-start' : 'flex-end';
    if (config.flow === 'top-down') {
        container.style.flexDirection = 'column';
    } else {
        container.style.flexDirection = 'column';
    }

    // Load styles.json to get class names (optional, but good for validation if needed)
    // For now, we assume class names follow the pattern theme-{name} and anim-{name}

    function createCommentElement(comment) {
        const el = document.createElement('div');
        el.className = `comment-box theme-${config.theme} anim-${config.inanim}`;

        // Inline styles for customization
        el.style.fontSize = config.fontsize;
        el.style.maxWidth = config.maxwidth;
        el.style.padding = config.padding;
        el.style.color = config.textcolor;
        el.style.animationDuration = config.animspeed;
        el.style.animationTimingFunction = config.easing;

        // Special styling
        if (config.scHighlight && comment.isSuperChat) {
            el.classList.add('super-chat');
        }
        if (comment.isMember) {
            el.classList.add('member-chat');
        }

        // Avatar
        if (config.showavatar) {
            const avatar = document.createElement('img');
            avatar.className = 'comment-avatar';
            avatar.src = comment.avatarUrl;
            el.appendChild(avatar);
        }

        // Content wrapper
        const content = document.createElement('div');
        content.className = 'comment-content';

        // Author Name
        if (config.showname) {
            const author = document.createElement('div');
            author.className = 'comment-author';
            author.textContent = comment.author;
            author.style.fontSize = config.namefontsize;
            content.appendChild(author);
        }

        // Text
        const text = document.createElement('div');
        text.className = 'comment-text';
        text.textContent = comment.text;
        content.appendChild(text);

        el.appendChild(content);

        // Animation end handler for cleanup if needed
        // el.addEventListener('animationend', () => {});

        return el;
    }

    function addComment(comment) {
        // Filtering
        if (config.showmember === 'member-only' && !comment.isMember) return;
        if (config.showmember === 'off' && comment.isMember) return; // Ambiguous requirement, assuming 'off' means hide member badge or hide members? 
        // Requirement says: "showmember: all / off / member-only". 
        // "off" likely means "don't treat members specially" OR "don't show members"? 
        // Usually "off" in this context might mean "don't show membership status" or "hide members".
        // Given "member-only", "off" might mean "hide members" or "hide membership UI".
        // Let's assume "off" means "hide membership indicators" but still show comment, OR "hide members".
        // Let's stick to standard filtering:
        // If 'member-only', show ONLY members.
        // If 'off', maybe it means 'hide member icons'? But here it's a filter category.
        // Let's assume 'off' means 'do not show comments from members'? No, that's rare.
        // Let's assume 'off' means 'disable member specific styling'?
        // Actually, let's look at the table: "メンバーシップ表示 (全表示 / 非表示 / メンバーのみ)".
        // "非表示" (Hidden) likely means "Don't show member comments" or "Don't show membership badge".
        // Given "Member Only" exists, "Hidden" likely means "Hide Member Comments" (weird) or "Hide Membership Badge".
        // Let's implement: 'member-only' -> only members. 'off' -> treat as normal user (no special class). 'all' -> show everything with classes.

        if (config.showmember === 'member-only' && !comment.isMember) return;

        // Exclude keywords
        if (config.exclude.some(keyword => comment.text.includes(keyword))) return;

        const el = createCommentElement(comment);

        if (config.flow === 'top-down') {
            container.prepend(el); // Add to top
        } else {
            container.appendChild(el); // Add to bottom
        }

        // Prune old comments
        const children = Array.from(container.children);
        if (children.length > config.maxlines) {
            const toRemove = config.flow === 'top-down' ? children[children.length - 1] : children[0];

            // Apply out animation
            toRemove.classList.remove(`anim-${config.inanim}`);
            toRemove.classList.add(`anim-${config.outanim}`);

            // Wait for animation to finish then remove
            // For simplicity/performance in high traffic, we might just remove it or set a timeout
            setTimeout(() => {
                if (toRemove.parentNode) toRemove.parentNode.removeChild(toRemove);
            }, parseFloat(config.animspeed) * 1000);

            // Force remove if too many pending removal to prevent memory leak
            if (children.length > config.maxlines + 5) {
                if (toRemove.parentNode) toRemove.parentNode.removeChild(toRemove);
            }
        }
    }

    // Dummy Data Generator
    if (config.mode === 'preview' || !config.id) {
        const dummyNames = ["User A", "Gamer 123", "Super Fan", "Tanaka", "OBS User"];
        const dummyTexts = [
            "Hello!",
            "This is a test comment.",
            "Wow, cool stream!",
            "Testing the overlay settings.",
            "Long comment to test wrapping and layout behavior. It should handle multiple lines gracefully.",
            "PogChamp",
            "Nice design!"
        ];

        setInterval(() => {
            const isSuperChat = Math.random() < 0.1;
            const isMember = Math.random() < 0.2;
            const comment = {
                author: dummyNames[Math.floor(Math.random() * dummyNames.length)],
                text: dummyTexts[Math.floor(Math.random() * dummyTexts.length)],
                isSuperChat: isSuperChat,
                isMember: isMember,
                avatarUrl: `https://placehold.co/40x40/${isMember ? '00FF00' : '00FFFF'}/FFFFFF?text=${isMember ? 'M' : 'U'}`
            };
            addComment(comment);
        }, 3000); // Every 3 seconds
    }

    // Real API implementation would go here
    // if (config.id && config.mode !== 'preview') { ... }
});
