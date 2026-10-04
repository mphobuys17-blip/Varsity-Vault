"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase/client";
import ResXchangeLogo from "../../components/ResXchangeLogo";

const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
const MAX_COVER_SIZE = 5 * 1024 * 1024;

export default function SellMusicPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [price, setPrice] = useState("");

  const [releaseType, setReleaseType] = useState<"paid" | "free">("paid");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setCheckingUser(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }

      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [coverPreview, audioPreview]);

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");

    if (file.size > MAX_AUDIO_SIZE) {
      setAudioFile(null);
      setAudioPreview("");
      setMessage("Audio file must be smaller than 50MB.");
      return;
    }

    setAudioFile(file);

    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }

    setAudioPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");

    if (file.size > MAX_COVER_SIZE) {
      setCoverFile(null);
      setCoverPreview("");
      setMessage("Cover art must be smaller than 5MB.");
      return;
    }

    setCoverFile(file);

    if (coverPreview) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview(URL.createObjectURL(file));
  };

  const handleReleaseTypeChange = (type: "paid" | "free") => {
    setReleaseType(type);

    if (type === "free") {
      setPrice("");
    }

    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");

    if (!userId) {
      setMessage("You need to be logged in.");
      return;
    }

    const cleanTitle = title.trim();
    const cleanArtist = artist.trim();

    if (!cleanTitle) {
      setMessage("Give your track a title.");
      return;
    }

    if (!cleanArtist) {
      setMessage("Enter the artist name.");
      return;
    }

    if (!audioFile) {
      setMessage("Upload an audio file.");
      return;
    }

    let numericPrice = 0;

    if (releaseType === "paid") {
      numericPrice = Number(price);

      if (!price.trim() || Number.isNaN(numericPrice) || numericPrice < 1) {
        setMessage("Enter a valid price of at least R1.");
        return;
      }
    }

    setUploading(true);

    try {
      const audioExtension =
        audioFile.name.split(".").pop()?.toLowerCase() || "mp3";

      const audioPath = `${userId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${audioExtension}`;

      const { error: audioUploadError } = await supabase.storage
        .from("music-audio")
        .upload(audioPath, audioFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: audioFile.type || "audio/mpeg",
        });

      if (audioUploadError) {
        throw new Error(
          `Audio upload failed: ${audioUploadError.message}`
        );
      }

      const {
        data: { publicUrl: audioUrl },
      } = supabase.storage.from("music-audio").getPublicUrl(audioPath);

      let coverUrl: string | null = null;

      if (coverFile) {
        const coverExtension =
          coverFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const coverPath = `${userId}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${coverExtension}`;

        const { error: coverUploadError } = await supabase.storage
          .from("music-covers")
          .upload(coverPath, coverFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: coverFile.type || "image/jpeg",
          });

        if (coverUploadError) {
          throw new Error(
            `Cover upload failed: ${coverUploadError.message}`
          );
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("music-covers").getPublicUrl(coverPath);

        coverUrl = publicUrl;
      }

      const { error: insertError } = await supabase.from("music").insert({
        title: cleanTitle,
        artist: cleanArtist,
        price: numericPrice,
        release_type: releaseType,
        audio_url: audioUrl,
        cover_url: coverUrl,
        user_id: userId,
      });

      if (insertError) {
        throw new Error(`Could not save track: ${insertError.message}`);
      }

      router.push("/music");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong while uploading your track.");
      }
    } finally {
      setUploading(false);
    }
  };

  if (checkingUser) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#111827",
          color: "#FFF9EF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p style={{ opacity: 0.7 }}>Checking account...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#FFF9EF",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #111827;
        }

        input,
        button {
          font-family: inherit;
        }

        .music-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 6vw;
          background: rgba(17, 24, 39, 0.92);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          color: #fff9ef;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          opacity: 0.7;
          transition: 0.2s ease;
        }

        .nav-link:hover {
          opacity: 1;
          color: #b8f500;
        }

        .nav-link.active {
          color: #b8f500;
          opacity: 1;
        }

        .hero {
          position: relative;
          padding: 80px 6vw 50px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.08;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.5) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          max-width: 850px;
        }

        .eyebrow {
          display: inline-flex;
          padding: 7px 12px;
          background: #b8f500;
          color: #111827;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transform: rotate(-2deg);
          margin-bottom: 24px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(48px, 9vw, 110px);
          line-height: 0.86;
          letter-spacing: -0.07em;
          text-transform: uppercase;
          font-weight: 1000;
        }

        .hero h1 span {
          color: #3a86ff;
        }

        .hero p {
          max-width: 600px;
          margin: 28px 0 0;
          color: rgba(255, 249, 239, 0.65);
          font-size: 17px;
          line-height: 1.6;
        }

        .form-wrap {
          width: min(900px, 88vw);
          margin: 50px auto 100px;
        }

        .form-card {
          padding: clamp(24px, 5vw, 50px);
          background: #fff9ef;
          color: #111827;
          border: 3px solid #111827;
          box-shadow: 12px 12px 0 #b8f500;
        }

        .section-title {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 1000;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }

        .section-subtitle {
          margin: 0 0 30px;
          color: rgba(17, 24, 39, 0.6);
          line-height: 1.5;
        }

        .field {
          margin-bottom: 24px;
        }

        .field label {
          display: block;
          margin-bottom: 9px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .field input {
          width: 100%;
          padding: 16px 17px;
          border: 2px solid #111827;
          background: white;
          color: #111827;
          outline: none;
          font-size: 16px;
          transition: 0.2s ease;
        }

        .field input:focus {
          border-color: #3a86ff;
          box-shadow: 4px 4px 0 #3a86ff;
        }

        .release-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 10px;
        }

        .release-option {
          position: relative;
          cursor: pointer;
        }

        .release-option input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .release-box {
          display: block;
          padding: 22px;
          border: 2px solid #111827;
          background: white;
          transition: 0.2s ease;
        }

        .release-option input:checked + .release-box {
          background: #b8f500;
          box-shadow: 5px 5px 0 #3a86ff;
          transform: translate(-2px, -2px);
        }

        .release-box strong {
          display: block;
          font-size: 18px;
          font-weight: 1000;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .release-box span {
          display: block;
          font-size: 13px;
          line-height: 1.4;
          opacity: 0.65;
        }

        .upload-area {
          display: block;
          border: 2px dashed #111827;
          background: rgba(58, 134, 255, 0.06);
          padding: 24px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .upload-area:hover {
          background: rgba(184, 245, 0, 0.18);
          border-color: #3a86ff;
        }

        .upload-area input {
          display: none;
        }

        .upload-title {
          font-size: 16px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .upload-info {
          font-size: 12px;
          opacity: 0.6;
        }

        .preview-cover {
          width: 130px;
          height: 130px;
          object-fit: cover;
          margin-top: 18px;
          border: 3px solid #111827;
          display: block;
        }

        .audio-preview {
          width: 100%;
          margin-top: 18px;
        }

        .submit-button {
          width: 100%;
          border: 0;
          padding: 20px;
          background: #111827;
          color: #b8f500;
          font-size: 16px;
          font-weight: 1000;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .submit-button:hover {
          background: #3a86ff;
          color: white;
          transform: translate(-3px, -3px);
          box-shadow: 6px 6px 0 #b8f500;
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .message {
          margin-bottom: 20px;
          padding: 14px 16px;
          background: #111827;
          color: #fff9ef;
          border-left: 5px solid #b8f500;
          font-size: 14px;
          line-height: 1.5;
        }

        @media (max-width: 700px) {
          .music-nav {
            padding: 15px 5vw;
          }

          .nav-links {
            gap: 12px;
          }

          .nav-link {
            font-size: 12px;
          }

          .hero {
            padding: 60px 5vw 40px;
          }

          .form-wrap {
            width: 90vw;
            margin-top: 35px;
          }

          .form-card {
            box-shadow: 7px 7px 0 #b8f500;
          }

          .release-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className="music-nav">
        <Link href="/music">
          <ResXchangeLogo compact className="h-10 w-auto" />
        </Link>

        <div className="nav-links">
          <Link href="/" className="nav-link">
            Marketplace
          </Link>

          <Link href="/music" className="nav-link">
            Music
          </Link>

          <Link href="/music/sell" className="nav-link active">
            Drop Music
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="eyebrow">ResXchange Music</div>

          <h1>
            DROP YOUR
            <br />
            <span>SHII.</span>
          </h1>

          <p>
            Sell your music or let people download it for free. No fancy
            industry paperwork. Just put your sound out there.
          </p>
        </div>
      </section>

      <div className="form-wrap">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="section-title">New Release</h2>

          <p className="section-subtitle">
            Put the essentials in. Keep the rest of the noise out.
          </p>

          {message && <div className="message">{message}</div>}

          <div className="field">
            <label htmlFor="title">Track Title</label>

            <input
              id="title"
              type="text"
              placeholder="e.g. Midnight in Pretoria"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
            />
          </div>

          <div className="field">
            <label htmlFor="artist">Artist Name</label>

            <input
              id="artist"
              type="text"
              placeholder="Your artist name"
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
              maxLength={100}
            />
          </div>

          <div className="field">
            <label>Release Type</label>

            <div className="release-options">
              <label className="release-option">
                <input
                  type="radio"
                  name="releaseType"
                  value="paid"
                  checked={releaseType === "paid"}
                  onChange={() => handleReleaseTypeChange("paid")}
                />

                <span className="release-box">
                  <strong>💰 Sell It</strong>
                  <span>
                    Set your own price and put your track up for sale.
                  </span>
                </span>
              </label>

              <label className="release-option">
                <input
                  type="radio"
                  name="releaseType"
                  value="free"
                  checked={releaseType === "free"}
                  onChange={() => handleReleaseTypeChange("free")}
                />

                <span className="release-box">
                  <strong>🆓 Free Download</strong>
                  <span>
                    Give the track away and let people download it for free.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {releaseType === "paid" && (
            <div className="field">
              <label htmlFor="price">Price (ZAR)</label>

              <input
                id="price"
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 25"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="audio">Audio File</label>

            <label className="upload-area">
              <input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
              />

              <div className="upload-title">
                {audioFile ? audioFile.name : "Choose your audio"}
              </div>

              <div className="upload-info">
                MP3, WAV, M4A and other audio formats · Max 50MB
              </div>

              {audioPreview && (
                <audio
                  className="audio-preview"
                  controls
                  src={audioPreview}
                />
              )}
            </label>
          </div>

          <div className="field">
            <label htmlFor="cover">Cover Art</label>

            <label className="upload-area">
              <input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
              />

              <div className="upload-title">
                {coverFile ? coverFile.name : "Choose cover art"}
              </div>

              <div className="upload-info">
                JPG, PNG, WEBP and other image formats · Max 5MB
              </div>

              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="preview-cover"
                />
              )}
            </label>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={uploading}
          >
            {uploading
              ? "Dropping Your Shii..."
              : releaseType === "paid"
              ? "Put It Up For Sale →"
              : "Drop Free Download →"}
          </button>
        </form>
      </div>
    </main>
  );
}