import React, { useState, useEffect } from "react";
import OriginalImage from "rc-image";
import axios from "axios";

const cacheSize = 100;

const Image: React.FC<CachedImageProps> = (props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const cacheKey = `cachedImage:${props.src}`;

  useEffect(() => {
    const cacheImage = async () => {
      try {
        // Check if the source is local or remote
        const isLocalSource = /^(file:|localhost:|127\.0\.0\.1:)/.test(
          props.src,
        );
        const isDevelopment = import.meta.env.MODE === "development";

        if (!isLocalSource || isDevelopment) {
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            console.log("Using cached image");
            const { localUrl, expiration } = JSON.parse(cachedData);
            if (new Date(expiration) > new Date()) {
              setImageUrl(localUrl);
              return;
            }
          }

          // Set it right away and we'll cache it for next time
          setImageUrl(props.src);

          const response = await axios.get(props.src, {
            responseType: "blob",
          });
          const blob = response.data;
          const localUrl = URL.createObjectURL(blob);

          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              localUrl,
              expiration: expirationDate.toISOString(),
            }),
          );
        } else {
          // If the source is local, use the original src
          setImageUrl(props.src);
        }
      } catch (error) {
        //console.error("Failed to cache image:", error);
      }
    };

    cacheImage();
  }, [props.src, cacheKey]);

  return imageUrl ? (
    <OriginalImage {...props} src={imageUrl} />
  ) : (
    props.fallback
  );
};

export default Image;
