const MentionRenderer = ({ children }) => {
    return <strong>{children}</strong>;
};


<ReactMarkdown
    components={{
        strong: MentionRenderer
    }}
>
    {comment.content}
</ReactMarkdown>