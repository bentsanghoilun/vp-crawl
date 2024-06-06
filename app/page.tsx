"use client";

import { Menu } from "@/types/menu";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from "axios";
import { useCallback, useState } from "react";
import { useBoolean } from "usehooks-ts";
import { styled } from '@mui/system';

export default function Home() {
  const [url, setUrl] = useState("");
  const [scriptText, setScriptText] = useState("");
  const loading = useBoolean();

  const handleCrawl = useCallback(async () => {
    try {
      setScriptText("")
      loading.setTrue();
      const res = await axios.request({
        url: "/api/crawl",
        method: "POST",
        data: { url },
      });

      console.log("menus", res.data);

      const { menus, scriptString } = res.data as {
        menus: Menu[];
        scriptString: string;
      };

      setScriptText(scriptString)

      // const blob = new Blob([scriptString], { type: "text/php" });
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = "functions.php";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      loading.setFalse()
    } catch (error) {
      console.error("Error", error);
      loading.setFalse();
    }
  }, [url, loading]);

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border: 1px solid #888;
    border-radius: 8px;
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  return (
    <main>
      <Container
        sx={{
          py: 16,
        }}
      >
        <Stack spacing={3}>
          <TextField
            label={"Url"}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <LoadingButton
            disabled={!url || loading.value}
            loading={loading.value}
            color="primary"
            onClick={handleCrawl}
            variant="contained"
          >
            Crawl
          </LoadingButton>

          <Textarea minRows={30} defaultValue={scriptText} />
        </Stack>
      </Container>
    </main>
  );
}
