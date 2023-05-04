import Head from 'next/head';
import Link from 'next/link';
import styles from './layout.module.css';

const siteTitle = "Suited Next.js Evaluation Project";

export default function Layout({ pageTitle="", home=false, children }) {
  const title = `${siteTitle}${pageTitle ? ` ${pageTitle}` : ""}`;
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Sutied is learning about Next.js!"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <title>{title}</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.siteTitle}>{siteTitle}</div>
        <div className={styles.pageTitle}>{pageTitle}</div>
      </header>
      <main className={styles["container-main"]}>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
