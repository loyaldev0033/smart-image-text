export const getTwitterShareLink = (shareLink: string, content: string) => {
  return `https://twitter.com/intent/tweet?original_referer=${shareLink}&text=${content}&tw_p=tweetbutton&url=${shareLink}`;
};

export const getEmailShare = (shareLink: string, content: string) => {
  return `${content}

${shareLink}`;
};

export const getLinkedinShareLink = (
  shareLink: string,
  subject: string,
  content: string,
) => {
  return `https://www.linkedin.com/feed/?shareActive=true&text=${subject}%0A%0D%0A${content}%0A%0D%0A${shareLink}`;
};
