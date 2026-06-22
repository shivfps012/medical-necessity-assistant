from fastapi import FastAPI

from app.api.routes import analyze, ask

app = FastAPI(
    title="Medical Necessity Assistant",
    description=(
        "Clinical coding compliance assistant for UAE healthcare (Abu Dhabi DOH). "
        "Answers strictly from five ingested guideline documents: AMA 2021, "
        "1997 CMS, JAWDA Part IX, Clinical Coding Process Review, and the HAAD Coding Manual."
    ),
    version="1.0.0",
)

app.include_router(analyze.router)
app.include_router(ask.router)


@app.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok"}
