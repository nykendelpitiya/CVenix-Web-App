import json
import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Resume"],
)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


class GenerateResumeRequest(BaseModel):
    full_name: str = ""
    job_title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""

    education: str = ""
    skills: str = ""
    experience: str = ""
    projects: str = ""
    certifications: str = ""
    achievements: str = ""
    languages: str = ""
    career_goal: str = ""
    experience_level: str = "Entry Level"


class GenerateResumeResponse(BaseModel):
    summary: str
    skills: str
    experience: str
    education: str
    projects: str
    certifications: str
    achievements: str
    languages: str
    hobbies: str
    reference_details: str


def extract_json(text: str) -> dict:
    cleaned = text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned.replace("```json", "", 1).strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.replace("```", "", 1).strip()

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    return json.loads(cleaned)


def to_text(value) -> str:
    if value is None:
        return ""

    if isinstance(value, str):
        return value.strip()

    if isinstance(value, list):
        lines = []

        for item in value:
            if isinstance(item, dict):
                parts = []

                for key, val in item.items():
                    if val:
                        parts.append(str(val))

                if parts:
                    lines.append(" - ".join(parts))
            else:
                lines.append(str(item))

        return "\n".join(lines).strip()

    if isinstance(value, dict):
        lines = []

        for key, val in value.items():
            if isinstance(val, list):
                lines.append(f"{key}:")
                lines.extend([f"- {item}" for item in val])
            elif val:
                lines.append(f"{key}: {val}")

        return "\n".join(lines).strip()

    return str(value).strip()


@router.post(
    "/generate-resume",
    response_model=GenerateResumeResponse,
)
def generate_resume(data: GenerateResumeRequest):
    try:
        system_prompt = """
You are a professional ATS resume writer.

Create improved resume content from the user's details.

Very important rules:
- Return ONLY valid JSON.
- Do not include markdown.
- Do not add fake company names.
- Do not invent degrees, certificates, jobs, dates, years, months, or project periods.
- Preserve all user-provided time periods exactly as they are.
- If the user gives 2019 - 2025, keep 2019 - 2025.
- If the user gives 2025 October - 2025 December, keep it exactly.
- If the user gives 2025 March - 2026 June, keep it exactly.
- Do not change start period or end period.
- Improve only the wording of descriptions, responsibilities, project summaries, and achievements.
- Every JSON value must be a STRING only.
- Do not return arrays.
- Do not return nested objects.
- Use newline characters inside strings for multiple lines.
- Keep the language simple, professional, ATS-friendly, and realistic.
- Use concise bullet-style lines where suitable.
- Make it suitable for job applications.
- Keep content realistic for the given experience level.

For Work Experience:
- Keep role/title, company/organization, location, and period from user input.
- Improve description only.

For Education:
- Keep degree/course, institute/university, location, and period from user input.
- Improve description only if needed.

For Projects:
- Keep project name, technology stack/client, location, and period from user input.
- Improve project description only.

Return JSON using exactly these keys:
{
  "summary": "",
  "skills": "",
  "experience": "",
  "education": "",
  "projects": "",
  "certifications": "",
  "achievements": "",
  "languages": "",
  "hobbies": "",
  "reference_details": ""
}
"""

        user_prompt = f"""
Full Name: {data.full_name}
Job Title / Target Role: {data.job_title}
Email: {data.email}
Phone: {data.phone}
Location: {data.location}

Experience Level: {data.experience_level}

Career Goal / Summary Input:
{data.career_goal}

Skills:
{data.skills}

Work Experience with Periods:
{data.experience}

Education with Periods:
{data.education}

Projects with Periods:
{data.projects}

Certifications:
{data.certifications}

Achievements:
{data.achievements}

Languages:
{data.languages}

Generate improved professional CV content.

Remember:
- Preserve all dates and periods exactly.
- Do not invent missing dates.
- Do not invent missing companies, degrees, or certificates.
- Return only JSON.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            temperature=0.4,
            max_tokens=1800,
        )

        result = response.choices[0].message.content or ""

        parsed = extract_json(result)

        return GenerateResumeResponse(
            summary=to_text(parsed.get("summary")),
            skills=to_text(parsed.get("skills")),
            experience=to_text(parsed.get("experience")),
            education=to_text(parsed.get("education")),
            projects=to_text(parsed.get("projects")),
            certifications=to_text(parsed.get("certifications")),
            achievements=to_text(parsed.get("achievements")),
            languages=to_text(parsed.get("languages")),
            hobbies=to_text(parsed.get("hobbies")),
            reference_details=to_text(parsed.get("reference_details")),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )