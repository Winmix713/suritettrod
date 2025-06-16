import { http, HttpResponse } from "msw"

// Figma API mock responses
const mockFigmaFile = {
  document: {
    id: "0:0",
    name: "Test Document",
    type: "DOCUMENT",
    children: [
      {
        id: "1:1",
        name: "Page 1",
        type: "CANVAS",
        children: [
          {
            id: "2:1",
            name: "Frame 1",
            type: "FRAME",
            backgroundColor: { r: 1, g: 1, b: 1, a: 1 },
            absoluteBoundingBox: { x: 0, y: 0, width: 375, height: 812 },
            children: [
              {
                id: "3:1",
                name: "Button",
                type: "RECTANGLE",
                backgroundColor: { r: 0.2, g: 0.4, b: 1, a: 1 },
                absoluteBoundingBox: { x: 20, y: 20, width: 120, height: 40 },
                fills: [{ type: "SOLID", color: { r: 0.2, g: 0.4, b: 1 } }],
              },
            ],
          },
        ],
      },
    ],
  },
  components: {
    "3:1": {
      key: "test-component-key",
      name: "Button Component",
      description: "A test button component",
    },
  },
  styles: {},
  schemaVersion: 0,
  name: "Test File",
  lastModified: "2024-01-01T00:00:00.000Z",
  thumbnailUrl: "https://example.com/thumbnail.png",
  version: "1",
}

const mockFigmaImages = {
  images: {
    "3:1": "https://example.com/image1.png",
  },
}

const mockFigmaComponents = {
  meta: {
    components: [
      {
        key: "test-component-key",
        file_key: "test-file-key",
        node_id: "3:1",
        thumbnail_url: "https://example.com/component-thumb.png",
        name: "Button Component",
        description: "A test button component",
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z",
        user: {
          id: "123",
          handle: "testuser",
          img_url: "https://example.com/user.png",
        },
      },
    ],
  },
}

export const handlers = [
  // Get Figma file
  http.get("https://api.figma.com/v1/files/:fileKey", ({ params }) => {
    const { fileKey } = params

    if (fileKey === "invalid-key") {
      return HttpResponse.json({ status: 404, err: "File not found" }, { status: 404 })
    }

    return HttpResponse.json(mockFigmaFile)
  }),

  // Get Figma file images
  http.get("https://api.figma.com/v1/images/:fileKey", ({ params, request }) => {
    const { fileKey } = params
    const url = new URL(request.url)
    const ids = url.searchParams.get("ids")

    if (!ids) {
      return HttpResponse.json({ status: 400, err: "Missing ids parameter" }, { status: 400 })
    }

    return HttpResponse.json(mockFigmaImages)
  }),

  // Get team components
  http.get("https://api.figma.com/v1/teams/:teamId/components", ({ params }) => {
    const { teamId } = params

    if (teamId === "invalid-team") {
      return HttpResponse.json({ status: 403, err: "Forbidden" }, { status: 403 })
    }

    return HttpResponse.json(mockFigmaComponents)
  }),

  // OpenAI API mock
  http.post("https://api.openai.com/v1/chat/completions", () => {
    return HttpResponse.json({
      id: "chatcmpl-test",
      object: "chat.completion",
      created: Date.now(),
      model: "gpt-4",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: `
import React from 'react';

export function GeneratedComponent() {
  return (
    <div className="bg-blue-500 text-white px-4 py-2 rounded">
      Generated Button
    </div>
  );
}
            `.trim(),
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
        total_tokens: 150,
      },
    })
  }),

  // GitHub API mock
  http.post("https://api.github.com/user/repos", () => {
    return HttpResponse.json({
      id: 123456,
      name: "figma-export-test",
      full_name: "testuser/figma-export-test",
      html_url: "https://github.com/testuser/figma-export-test",
      clone_url: "https://github.com/testuser/figma-export-test.git",
    })
  }),

  // GitHub file upload mock
  http.put("https://api.github.com/repos/:owner/:repo/contents/:path", () => {
    return HttpResponse.json({
      content: {
        name: "test-file.tsx",
        path: "src/components/test-file.tsx",
        sha: "abc123",
        html_url: "https://github.com/testuser/figma-export-test/blob/main/src/components/test-file.tsx",
      },
      commit: {
        sha: "def456",
        html_url: "https://github.com/testuser/figma-export-test/commit/def456",
      },
    })
  }),
]
