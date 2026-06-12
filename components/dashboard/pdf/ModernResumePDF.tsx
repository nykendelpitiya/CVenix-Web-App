import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

type CustomSection = {
  id: number;
  title: string;
  content: string;
};

type ResumeData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  languages?: string;
  hobbies?: string;
  profileImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  layoutKey?: string;
  customSections?: CustomSection[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  projects?: string;
  certifications?: string;
  achievements?: string;
  referenceDetails?: string;
  reference_details?: string;
};

type ModernResumePDFProps = {
  data: ResumeData;
};

type LinkItem = {
  label: string;
  url: string;
  displayUrl: string;
};

type TimelineItem = {
  id?: number;
  title: string;
  organization: string;
  location: string;
  startPeriod: string;
  endPeriod: string;
  description: string;
};

const wrapText = {
  overflowWrap: "break-word" as const,
  wordBreak: "keep-all" as const,
  hyphens: "none" as const,
};

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#111827",
  },

  rowPage: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#111827",
  },

  sidebar: {
    width: "34%",
    padding: 26,
    color: "#ffffff",
  },

  content: {
    width: "66%",
    padding: 32,
  },

  contentWide: {
    padding: 36,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#e5e7eb",
    marginBottom: 20,
    objectFit: "cover",
  },

  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e5e7eb",
    objectFit: "cover",
  },

  name: {
    ...wrapText,
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },

  title: {
    ...wrapText,
    marginTop: 7,
    fontSize: 13,
    fontWeight: "bold",
  },

  contactLine: {
    ...wrapText,
    fontSize: 8.8,
    lineHeight: 1.65,
    color: "#f3f4f6",
  },

  contactLineDark: {
    ...wrapText,
    fontSize: 8.8,
    lineHeight: 1.65,
    color: "#374151",
  },

  linkText: {
    ...wrapText,
    fontSize: 8.8,
    lineHeight: 1.65,
    textDecoration: "none",
  },

  headerMeta: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  headerMetaText: {
    ...wrapText,
    fontSize: 8.8,
    color: "#4b5563",
  },

  sideSection: {
    marginTop: 19,
  },

  sideTitle: {
    ...wrapText,
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1.4,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff",
    paddingBottom: 6,
    marginBottom: 8,
  },

  sideText: {
    ...wrapText,
    fontSize: 8.8,
    lineHeight: 1.65,
    color: "#f3f4f6",
  },

  mainHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 16,
    marginBottom: 16,
  },

  section: {
    marginTop: 15,
  },

  sectionTitle: {
    ...wrapText,
    fontSize: 10.8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 6,
    marginBottom: 8,
  },

  bodyText: {
    ...wrapText,
    fontSize: 9.8,
    lineHeight: 1.55,
    color: "#374151",
  },

  goldHeader: {
    padding: 28,
    color: "#ffffff",
  },

  goldBand: {
    height: 22,
  },

  goldTitleBox: {
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  goldTitleText: {
    ...wrapText,
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },

  greenSide: {
    width: "34%",
    padding: 28,
  },

  greenMain: {
    width: "66%",
    padding: 30,
  },

  yellowSide: {
    width: "34%",
    padding: 26,
    backgroundColor: "#2f2f2f",
    color: "#ffffff",
  },

  yellowMain: {
    width: "66%",
    padding: 32,
  },

  darkSide: {
    width: "38%",
    padding: 28,
    color: "#ffffff",
  },

  darkMain: {
    width: "62%",
    padding: 32,
  },

  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 8,
  },

  timelineItem: {
    marginBottom: 10,
  },

  timelineHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 3,
  },

  timelineTitle: {
    ...wrapText,
    flex: 1,
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
  },

  timelinePeriod: {
    ...wrapText,
    width: 105,
    fontSize: 8.5,
    fontWeight: "bold",
    textAlign: "right",
    color: "#374151",
  },

  timelineMeta: {
    ...wrapText,
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 3,
  },

  timelineDescription: {
    ...wrapText,
    fontSize: 9,
    lineHeight: 1.5,
    color: "#374151",
  },

  timelineSideTitle: {
    ...wrapText,
    fontSize: 8.8,
    fontWeight: "bold",
    color: "#f9fafb",
    marginTop: 4,
  },

  timelineSidePeriod: {
    ...wrapText,
    fontSize: 8,
    color: "#e5e7eb",
    marginTop: 2,
  },
});

const clean = (value?: string | null) => (value || "").trim();

const hasText = (value?: string | null) => Boolean(clean(value));

const normalizeUrl = (url?: string) => {
  const value = clean(url);

  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `https://${value}`;
};

const getDisplayUrl = (url?: string) =>
  clean(url)
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

const getContactItems = (data: ResumeData) =>
  [data.email, data.phone, data.location].map(clean).filter(Boolean);

const getLinkItems = (data: ResumeData): LinkItem[] =>
  [
    {
      label: "LinkedIn",
      url: normalizeUrl(data.linkedinUrl),
      displayUrl: getDisplayUrl(data.linkedinUrl),
    },
    {
      label: "GitHub",
      url: normalizeUrl(data.githubUrl),
      displayUrl: getDisplayUrl(data.githubUrl),
    },
    {
      label: "Portfolio",
      url: normalizeUrl(data.portfolioUrl),
      displayUrl: getDisplayUrl(data.portfolioUrl),
    },
    {
      label: "Website",
      url: normalizeUrl(data.websiteUrl),
      displayUrl: getDisplayUrl(data.websiteUrl),
    },
  ].filter((item) => item.url);

const hasContactDetails = (data: ResumeData) =>
  getContactItems(data).length > 0 || getLinkItems(data).length > 0;

const parseTimelineContent = (content?: string | null): TimelineItem[] | null => {
  const value = clean(content);

  if (!value.startsWith("[") && !value.startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    const rawItems = Array.isArray(parsed) ? parsed : [parsed];

    const items = rawItems
      .map((item) => ({
        id: Number(item?.id) || undefined,
        title: clean(item?.title),
        organization: clean(item?.organization),
        location: clean(item?.location),
        startPeriod: clean(item?.startPeriod),
        endPeriod: clean(item?.endPeriod),
        description: clean(item?.description),
      }))
      .filter(
        (item) =>
          item.title ||
          item.organization ||
          item.location ||
          item.startPeriod ||
          item.endPeriod ||
          item.description
      );

    return items.length ? items : null;
  } catch {
    return null;
  }
};

const hasMeaningfulTimelineJson = (value?: string | null) => {
  const content = clean(value);

  if (!content) return false;

  if (!content.startsWith("[") && !content.startsWith("{")) {
    return true;
  }

  try {
    const parsed = JSON.parse(content);
    const rawItems = Array.isArray(parsed) ? parsed : [parsed];

    return rawItems.some((item) =>
      Boolean(
        clean(item?.title) ||
          clean(item?.organization) ||
          clean(item?.location) ||
          clean(item?.startPeriod) ||
          clean(item?.endPeriod) ||
          clean(item?.description)
      )
    );
  } catch {
    return true;
  }
};

const hasVisibleContent = (value?: string | null) =>
  hasMeaningfulTimelineJson(value);

const formatPeriod = (item: TimelineItem) => {
  const start = clean(item.startPeriod);
  const end = clean(item.endPeriod);

  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;

  return "";
};

const formatTimelineMeta = (item: TimelineItem) => {
  const organization = clean(item.organization);
  const location = clean(item.location);

  if (organization && location) return `${organization} | ${location}`;
  if (organization) return organization;
  if (location) return location;

  return "";
};

const timelineToPlainText = (content?: string | null) => {
  const items = parseTimelineContent(content);

  if (!items) return clean(content);

  return items
    .map((item) => {
      const lines = [
        clean(item.title),
        formatPeriod(item),
        formatTimelineMeta(item),
        clean(item.description),
      ].filter(Boolean);

      return lines.join("\n");
    })
    .join("\n\n");
};

function getGeneratedSections(data: ResumeData): CustomSection[] {
  const referenceText = clean(data.referenceDetails) || clean(data.reference_details);

  const sections: CustomSection[] = [
    {
      id: -1,
      title: "Projects",
      content: clean(data.projects),
    },
    {
      id: -2,
      title: "Certifications",
      content: clean(data.certifications),
    },
    {
      id: -3,
      title: "Achievements",
      content: clean(data.achievements),
    },
    {
      id: -4,
      title: "References",
      content: referenceText,
    },
  ];

  return sections.filter(
    (section) => section.title.trim() && hasVisibleContent(section.content)
  );
}

function getAllVisibleSections(data: ResumeData): CustomSection[] {
  const generatedSections = getGeneratedSections(data);

  const manualSections =
    data.customSections?.filter(
      (section) => section.title.trim() && hasVisibleContent(section.content)
    ) || [];

  const mergedSections: CustomSection[] = [];
  const usedTitles = new Set<string>();

  [...generatedSections, ...manualSections].forEach((section) => {
    const normalizedTitle = section.title.trim().toLowerCase();

    if (!normalizedTitle || usedTitles.has(normalizedTitle)) return;

    usedTitles.add(normalizedTitle);
    mergedSections.push(section);
  });

  return mergedSections;
}

export default function ModernResumePDF({ data }: ModernResumePDFProps) {
  const layoutKey = data.layoutKey || "modern_sidebar";

  if (layoutKey === "gold_executive") return <GoldExecutivePDF data={data} />;
  if (layoutKey === "green_professional") return <GreenProfessionalPDF data={data} />;
  if (layoutKey === "yellow_creative") return <YellowCreativePDF data={data} />;
  if (layoutKey === "dark_portfolio") return <DarkPortfolioPDF data={data} />;
  if (layoutKey === "minimal_clean") return <MinimalCleanPDF data={data} />;
  if (layoutKey === "corporate_blue") return <CorporateBluePDF data={data} />;
  if (layoutKey === "creative_designer") return <CreativeDesignerPDF data={data} />;
  if (layoutKey === "blue_designer_sidebar") return <BlueDesignerSidebarPDF data={data} />;

  return <ModernSidebarPDF data={data} />;
}

function SidebarContent({
  data,
  primaryColor,
  secondaryColor,
  variant = "default",
}: {
  data: ResumeData;
  primaryColor: string;
  secondaryColor: string;
  variant?: "default" | "dark";
}) {
  return (
    <View
      style={[
        variant === "dark" ? styles.darkSide : styles.sidebar,
        { backgroundColor: primaryColor },
      ]}
    >
      <Avatar data={data} large={variant === "dark"} borderColor={variant === "dark" ? secondaryColor : undefined} />

      {variant === "dark" && hasText(data.fullName) && (
        <Text
          style={{
            ...wrapText,
            marginTop: 22,
            fontSize: 24,
            fontWeight: "bold",
            color: secondaryColor,
          }}
        >
          {data.fullName}
        </Text>
      )}

      {variant === "dark" && hasText(data.title) && (
        <Text
          style={{
            ...wrapText,
            marginTop: 8,
            fontSize: 12,
            color: "#ffffff",
          }}
        >
          {data.title}
        </Text>
      )}

      {hasContactDetails(data) && (
        <ContactSection
          data={data}
          title="Contact"
          side
          color={secondaryColor}
        />
      )}

      {hasVisibleContent(data.skills) && (
        variant === "dark" ? (
          <DarkSideSection title="Skills" content={data.skills} color={secondaryColor} />
        ) : (
          <SideSection title="Skills" content={data.skills} />
        )
      )}

      {hasVisibleContent(data.languages) && (
        variant === "dark" ? (
          <DarkSideSection title="Languages" content={data.languages || ""} color={secondaryColor} />
        ) : (
          <SideSection title="Languages" content={data.languages || ""} />
        )
      )}

      {hasVisibleContent(data.hobbies) && (
        variant === "dark" ? (
          <DarkSideSection title="Interests" content={data.hobbies || ""} color={secondaryColor} />
        ) : (
          <SideSection title="Hobbies" content={data.hobbies || ""} />
        )
      )}
    </View>
  );
}

function ModernSidebarPDF({ data }: ModernResumePDFProps) {
  const primaryColor = data.primaryColor || "#1f2937";
  const secondaryColor = data.secondaryColor || "#2563eb";

  return (
    <Document>
      <Page size="A4" style={styles.rowPage} wrap>
        <SidebarContent
          data={data}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />

        <View style={styles.content}>
          <Header data={data} color={secondaryColor} />

          <Section title="Profile" content={data.summary} color={secondaryColor} />

          <Section
            title="Work Experience"
            content={data.experience}
            color={secondaryColor}
          />

          <Section title="Education" content={data.education} color={secondaryColor} />

          <CustomSectionsPDF data={data} color={secondaryColor} />
        </View>
      </Page>
    </Document>
  );
}

function GoldExecutivePDF({ data }: ModernResumePDFProps) {
  const primaryColor = data.primaryColor || "#17313E";
  const secondaryColor = data.secondaryColor || "#C8A24D";
  const nameParts = clean(data.fullName).split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={[styles.goldHeader, { backgroundColor: primaryColor }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar data={data} large borderColor={secondaryColor} />

            <View style={{ marginLeft: 22, flex: 1 }}>
              {hasText(firstName) && (
                <Text
                  style={{
                    ...wrapText,
                    fontSize: 26,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 5,
                    color: secondaryColor,
                  }}
                >
                  {firstName}
                </Text>
              )}

              {hasText(lastName) && (
                <Text
                  style={{
                    ...wrapText,
                    fontSize: 26,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 5,
                    color: "#ffffff",
                  }}
                >
                  {lastName}
                </Text>
              )}

              {hasText(data.title) && (
                <Text
                  style={{
                    ...wrapText,
                    marginTop: 8,
                    fontSize: 10.5,
                    letterSpacing: 3.5,
                    color: "#ffffff",
                  }}
                >
                  {data.title}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.goldBand, { backgroundColor: secondaryColor }]} />

        <View style={styles.rowPage}>
          <SidebarContent
            data={data}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />

          <View style={styles.content}>
            <GoldSection title="Experience" content={data.experience} color={secondaryColor} />

            <GoldSection title="Education" content={data.education} color={secondaryColor} />

            <GoldSection title="Profile" content={data.summary} color={secondaryColor} />

            <CustomGoldSectionsPDF data={data} color={secondaryColor} />
          </View>
        </View>
      </Page>
    </Document>
  );
}

function GreenProfessionalPDF({ data }: ModernResumePDFProps) {
  const secondaryColor = data.secondaryColor || "#4CAF50";

  return (
    <Document>
      <Page size="A4" style={styles.rowPage} wrap>
        <View style={styles.greenSide}>
          <Avatar data={data} large borderColor="#d1fae5" />

          {hasText(data.fullName) && (
            <Text
              style={{
                ...wrapText,
                marginTop: 24,
                fontSize: 24,
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              {data.fullName}
            </Text>
          )}

          {hasText(data.title) && (
            <Text
              style={{
                ...wrapText,
                marginTop: 8,
                fontSize: 10.5,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: secondaryColor,
              }}
            >
              {data.title}
            </Text>
          )}

          {hasContactDetails(data) && (
            <ContactSection data={data} title="Contact" color={secondaryColor} dark />
          )}

          {hasVisibleContent(data.skills) && (
            <GreenSideSection title="Technical Skills" content={data.skills} color={secondaryColor} />
          )}

          {hasVisibleContent(data.languages) && (
            <GreenSideSection title="Languages" content={data.languages || ""} color={secondaryColor} />
          )}
        </View>

        <View style={styles.greenMain}>
          <Section title="Professional Summary" content={data.summary} color={secondaryColor} />

          <Section title="Employment" content={data.experience} color={secondaryColor} />

          <Section title="Education" content={data.education} color={secondaryColor} />

          <CustomSectionsPDF data={data} color={secondaryColor} />
        </View>
      </Page>
    </Document>
  );
}

function YellowCreativePDF({ data }: ModernResumePDFProps) {
  const secondaryColor = data.secondaryColor || "#FACC15";

  return (
    <Document>
      <Page size="A4" style={styles.rowPage} wrap>
        <View style={styles.yellowSide}>
          <Avatar data={data} large borderColor={secondaryColor} />

          {hasContactDetails(data) && (
            <ContactSection data={data} title="Contact Me" side />
          )}

          {hasVisibleContent(data.skills) && <SideSection title="Skills" content={data.skills} />}

          {hasVisibleContent(data.education) && (
            <SideSection title="Education" content={data.education} />
          )}

          {hasVisibleContent(data.hobbies) && (
            <SideSection title="Hobbies" content={data.hobbies || ""} />
          )}
        </View>

        <View style={styles.yellowMain}>
          {hasText(data.fullName) && (
            <Text
              style={{
                ...wrapText,
                fontSize: 26,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "#111827",
              }}
            >
              {data.fullName}
            </Text>
          )}

          {hasText(data.title) && (
            <Text
              style={{
                ...wrapText,
                marginTop: 8,
                fontSize: 11.5,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: secondaryColor,
              }}
            >
              {data.title}
            </Text>
          )}

          <YellowSection title="About Me" content={data.summary} color={secondaryColor} />

          <YellowSection title="Job Experience" content={data.experience} color={secondaryColor} />

          <YellowSection title="Skills" content={data.skills} color={secondaryColor} />

          <CustomYellowSectionsPDF data={data} color={secondaryColor} />
        </View>
      </Page>
    </Document>
  );
}

function DarkPortfolioPDF({ data }: ModernResumePDFProps) {
  const primaryColor = data.primaryColor || "#111827";
  const secondaryColor = data.secondaryColor || "#FBBF24";

  return (
    <Document>
      <Page size="A4" style={styles.rowPage} wrap>
        <SidebarContent
          data={data}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          variant="dark"
        />

        <View style={styles.darkMain}>
          <IconSection title="Profile" content={data.summary} color={secondaryColor} />

          <IconSection title="Experience" content={data.experience} color={secondaryColor} />

          <IconSection title="Education" content={data.education} color={secondaryColor} />

          <CustomIconSectionsPDF data={data} color={secondaryColor} />
        </View>
      </Page>
    </Document>
  );
}

function BlueDesignerSidebarPDF({ data }: ModernResumePDFProps) {
  const primaryColor = data.primaryColor || "#1f2937";
  const secondaryColor = data.secondaryColor || "#2563eb";

  return (
    <Document>
      <Page
        size="A4"
        style={{
          backgroundColor: "#ffffff",
          color: "#111827",
          fontFamily: "Helvetica",
        }}
        wrap
      >
        <View style={{ position: "relative" }}>
          <View
            style={{
              height: 102,
              backgroundColor: secondaryColor,
              paddingTop: 28,
              paddingBottom: 14,
              paddingHorizontal: 34,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <View style={{ width: "34%" }} />

              <View style={{ flex: 1, paddingLeft: 10 }}>
                {hasText(data.fullName) && (
                  <Text
                    style={{
                      ...wrapText,
                      fontSize: 27,
                      fontWeight: "bold",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      letterSpacing: 2.8,
                    }}
                  >
                    {data.fullName}
                  </Text>
                )}

                {hasText(data.title) && (
                  <Text
                    style={{
                      ...wrapText,
                      marginTop: 6,
                      fontSize: 10.5,
                      fontWeight: "bold",
                      color: "#dbeafe",
                      textTransform: "uppercase",
                      letterSpacing: 3.5,
                    }}
                  >
                    {data.title}
                  </Text>
                )}
              </View>
            </View>

            <View style={{ position: "absolute", left: 24, top: 38, zIndex: 2 }}>
              <Avatar data={data} large borderColor="#ffffff" />
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                width: "34%",
                backgroundColor: primaryColor,
                paddingHorizontal: 24,
                paddingTop: 54,
                paddingBottom: 28,
              }}
            >
              {hasVisibleContent(data.summary) && (
                <BlueSidebarPDFBlock
                  title="About Me"
                  content={data.summary}
                  color={secondaryColor}
                  bordered
                />
              )}

              {(getContactItems(data).length > 0 || getLinkItems(data).length > 0) && (
                <BlueSidebarPDFContact data={data} color={secondaryColor} />
              )}

              {hasVisibleContent(data.languages) && (
                <BlueSidebarPDFBlock
                  title="Language"
                  content={data.languages || ""}
                  color={secondaryColor}
                  bordered
                />
              )}

              {hasVisibleContent(data.skills) && (
                <BlueSidebarPDFBlock
                  title="Expertise"
                  content={data.skills}
                  color={secondaryColor}
                  bordered
                />
              )}
            </View>

            <View
              style={{
                width: "66%",
                backgroundColor: "#ffffff",
                paddingHorizontal: 34,
                paddingTop: 26,
                paddingBottom: 30,
              }}
            >
              <BlueMainPDFBlock title="Experience" content={data.experience} color={secondaryColor} />

              <BlueMainPDFBlock title="Education" content={data.education} color={secondaryColor} />

              <BlueMainPDFBlock title="Skills Summary" content={data.skills} color={secondaryColor} />

              <CustomSectionsPDF data={data} color={secondaryColor} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function MinimalCleanPDF({ data }: ModernResumePDFProps) {
  const color = data.primaryColor || "#0f172a";

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 40 }]} wrap>
        <Header data={data} color={color} showMeta />

        <Section title="Profile" content={data.summary} color={color} />

        <Section title="Experience" content={data.experience} color={color} />

        <Section title="Education" content={data.education} color={color} />

        <Section title="Skills" content={data.skills} color={color} />

        <CustomSectionsPDF data={data} color={color} />
      </Page>
    </Document>
  );
}

function CorporateBluePDF({ data }: ModernResumePDFProps) {
  const primaryColor = data.primaryColor || "#1e3a8a";
  const secondaryColor = data.secondaryColor || "#2563eb";

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={{ padding: 32, backgroundColor: primaryColor, color: "#ffffff" }}>
          {hasText(data.fullName) && (
            <Text
              style={{
                ...wrapText,
                fontSize: 26,
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {data.fullName}
            </Text>
          )}

          {hasText(data.title) && (
            <Text
              style={{
                ...wrapText,
                marginTop: 8,
                fontSize: 12.5,
                color: "#dbeafe",
              }}
            >
              {data.title}
            </Text>
          )}

          {hasContactDetails(data) && <HeaderContact data={data} light />}
        </View>

        <View style={{ padding: 32 }}>
          <Section title="Profile" content={data.summary} color={secondaryColor} />

          <Section title="Work Experience" content={data.experience} color={secondaryColor} />

          <Section title="Education" content={data.education} color={secondaryColor} />

          <Section title="Skills" content={data.skills} color={secondaryColor} />

          <CustomSectionsPDF data={data} color={secondaryColor} />
        </View>
      </Page>
    </Document>
  );
}

function CreativeDesignerPDF({ data }: ModernResumePDFProps) {
  const primaryColor = data.primaryColor || "#581c87";
  const secondaryColor = data.secondaryColor || "#db2777";

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 36 }]} wrap>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 18,
            backgroundColor: primaryColor,
            marginBottom: 22,
          }}
        />

        {hasText(data.fullName) && (
          <Text
            style={{
              ...wrapText,
              fontSize: 28,
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            {data.fullName}
          </Text>
        )}

        {hasText(data.title) && (
          <Text
            style={{
              ...wrapText,
              marginTop: 8,
              fontSize: 12.5,
              fontWeight: "bold",
              color: secondaryColor,
            }}
          >
            {data.title}
          </Text>
        )}

        {hasContactDetails(data) && (
          <HeaderContact data={data} color={secondaryColor} />
        )}

        <Section title="Profile" content={data.summary} color={secondaryColor} />

        <Section title="Projects / Experience" content={data.experience} color={secondaryColor} />

        <Section title="Skills" content={data.skills} color={secondaryColor} />

        <CustomSectionsPDF data={data} color={secondaryColor} />
      </Page>
    </Document>
  );
}

function TimelineItems({
  items,
  color,
}: {
  items: TimelineItem[];
  color: string;
}) {
  return (
    <View>
      {items.map((item, index) => {
        const period = formatPeriod(item);
        const meta = formatTimelineMeta(item);
        const title = clean(item.title);
        const description = clean(item.description);

        return (
          <View key={`${title}-${period}-${index}`} style={styles.timelineItem}>
            {(title || period) && (
              <View style={styles.timelineHeaderRow}>
                <Text style={styles.timelineTitle}>
                  {title || "Untitled"}
                </Text>

                {period && (
                  <Text style={[styles.timelinePeriod, { color }]}>
                    {period}
                  </Text>
                )}
              </View>
            )}

            {meta && <Text style={styles.timelineMeta}>{meta}</Text>}

            {description && (
              <Text style={styles.timelineDescription}>
                {description}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function TimelineSideText({
  content,
}: {
  content?: string;
}) {
  const items = parseTimelineContent(content);

  if (!items) {
    return <Text style={styles.sideText}>{content}</Text>;
  }

  return (
    <View>
      {items.map((item, index) => {
        const title = clean(item.title);
        const period = formatPeriod(item);
        const meta = formatTimelineMeta(item);
        const description = clean(item.description);

        return (
          <View key={`${title}-${period}-${index}`} style={{ marginBottom: 8 }}>
            {title && <Text style={styles.timelineSideTitle}>{title}</Text>}
            {period && <Text style={styles.timelineSidePeriod}>{period}</Text>}
            {meta && <Text style={styles.sideText}>{meta}</Text>}
            {description && <Text style={styles.sideText}>{description}</Text>}
          </View>
        );
      })}
    </View>
  );
}

function Avatar({
  data,
  large,
  borderColor,
}: {
  data: ResumeData;
  large?: boolean;
  borderColor?: string;
}) {
  const avatarStyle = large ? styles.avatarLarge : styles.avatar;
  const PdfImage = Image as unknown as React.ComponentType<{
    src: string;
    alt?: string;
    style?: unknown;
  }>;

  if (data.profileImageUrl) {
    return (
      <PdfImage
        src={data.profileImageUrl}
        alt=""
        style={[
          avatarStyle,
          borderColor
            ? {
                borderWidth: 3,
                borderColor,
              }
            : {},
        ]}
      />
    );
  }

  return (
    <View
      style={[
        avatarStyle,
        borderColor
          ? {
              borderWidth: 3,
              borderColor,
            }
          : {},
      ]}
    />
  );
}

function Header({
  data,
  color,
  showMeta = false,
}: {
  data: ResumeData;
  color: string;
  showMeta?: boolean;
}) {
  return (
    <View style={styles.mainHeader}>
      {hasText(data.fullName) && <Text style={styles.name}>{data.fullName}</Text>}

      {hasText(data.title) && (
        <Text style={[styles.title, { color }]}>
          {data.title}
        </Text>
      )}

      {showMeta && hasContactDetails(data) && (
        <HeaderContact data={data} color={color} />
      )}
    </View>
  );
}

function HeaderContact({
  data,
  color = "#4b5563",
  light = false,
}: {
  data: ResumeData;
  color?: string;
  light?: boolean;
}) {
  const contactItems = getContactItems(data);
  const linkItems = getLinkItems(data);
  const textColor = light ? "#dbeafe" : color;

  if (contactItems.length === 0 && linkItems.length === 0) return null;

  return (
    <View style={styles.headerMeta}>
      {contactItems.map((item) => (
        <Text key={item} style={[styles.headerMetaText, { color: textColor }]}>
          {item}
        </Text>
      ))}

      {linkItems.map((item) => (
        <Link
          key={item.label}
          src={item.url}
          style={[styles.headerMetaText, { color: textColor, textDecoration: "none" }]}
        >
          {item.label} - {item.displayUrl}
        </Link>
      ))}
    </View>
  );
}

function ContactSection({
  data,
  title,
  side = false,
  dark = false,
  color = "#ffffff",
}: {
  data: ResumeData;
  title: string;
  side?: boolean;
  dark?: boolean;
  color?: string;
}) {
  const contactItems = getContactItems(data);
  const linkItems = getLinkItems(data);

  if (contactItems.length === 0 && linkItems.length === 0) return null;

  if (dark) {
    return (
      <View style={styles.sideSection}>
        <Text
          style={{
            fontSize: 9.5,
            fontWeight: "bold",
            color: "#111827",
            borderBottomWidth: 1,
            borderBottomColor: color,
            paddingBottom: 6,
            marginBottom: 8,
          }}
        >
          {title}
        </Text>

        {contactItems.map((item) => (
          <Text key={item} style={styles.contactLineDark}>
            {item}
          </Text>
        ))}

        {linkItems.map((item) => (
          <Link
            key={item.label}
            src={item.url}
            style={[styles.contactLineDark, { textDecoration: "none", color }]}
          >
            {item.label} - {item.displayUrl}
          </Link>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.sideSection}>
      <Text style={styles.sideTitle}>{title}</Text>

      {contactItems.map((item) => (
        <Text key={item} style={side ? styles.contactLine : styles.bodyText}>
          {item}
        </Text>
      ))}

      {linkItems.map((item) => (
        <Link
          key={item.label}
          src={item.url}
          style={[
            side ? styles.contactLine : styles.linkText,
            { color: side ? "#f3f4f6" : color, textDecoration: "none" },
          ]}
        >
          {item.label} - {item.displayUrl}
        </Link>
      ))}
    </View>
  );
}

function SideSection({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  if (!hasVisibleContent(content)) return null;

  return (
    <View style={styles.sideSection}>
      <Text style={styles.sideTitle}>{title}</Text>
      <TimelineSideText content={content} />
    </View>
  );
}

function Section({
  title,
  content,
  color,
}: {
  title: string;
  content?: string;
  color: string;
}) {
  if (!hasVisibleContent(content)) return null;

  const timelineItems = parseTimelineContent(content);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>
        {title}
      </Text>

      {timelineItems ? (
        <TimelineItems items={timelineItems} color={color} />
      ) : (
        <Text style={styles.bodyText}>{content}</Text>
      )}
    </View>
  );
}

function GoldSection({
  title,
  content,
  color,
}: {
  title: string;
  content?: string;
  color: string;
}) {
  if (!hasVisibleContent(content)) return null;

  const timelineItems = parseTimelineContent(content);

  return (
    <View style={styles.section}>
      <View style={[styles.goldTitleBox, { backgroundColor: color }]}>
        <Text style={styles.goldTitleText}>{title}</Text>
      </View>

      {timelineItems ? (
        <TimelineItems items={timelineItems} color={color} />
      ) : (
        <Text style={styles.bodyText}>{content}</Text>
      )}
    </View>
  );
}

function GreenSideSection({
  title,
  content,
  color,
}: {
  title: string;
  content?: string;
  color: string;
}) {
  if (!hasVisibleContent(content)) return null;

  return (
    <View style={styles.sideSection}>
      <Text
        style={{
          fontSize: 9.5,
          fontWeight: "bold",
          color: "#111827",
          borderBottomWidth: 1,
          borderBottomColor: color,
          paddingBottom: 6,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          ...wrapText,
          fontSize: 8.8,
          lineHeight: 1.65,
          color: "#374151",
        }}
      >
        {timelineToPlainText(content)}
      </Text>
    </View>
  );
}

function YellowSection({
  title,
  content,
  color,
}: {
  title: string;
  content?: string;
  color: string;
}) {
  if (!hasVisibleContent(content)) return null;

  const timelineItems = parseTimelineContent(content);

  return (
    <View
      style={{
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: color,
        paddingLeft: 13,
      }}
    >
      <Text
        style={{
          fontSize: 10.5,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {timelineItems ? (
        <TimelineItems items={timelineItems} color={color} />
      ) : (
        <Text style={styles.bodyText}>{content}</Text>
      )}
    </View>
  );
}

function DarkSideSection({
  title,
  content,
  color,
}: {
  title: string;
  content?: string;
  color: string;
}) {
  if (!hasVisibleContent(content)) return null;

  return (
    <View style={styles.sideSection}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "bold",
          color,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          height: 1,
          backgroundColor: "#ffffff",
          opacity: 0.25,
          marginBottom: 8,
        }}
      />

      <TimelineSideText content={content} />
    </View>
  );
}

function IconSection({
  title,
  content,
  color,
}: {
  title: string;
  content?: string;
  color: string;
}) {
  if (!hasVisibleContent(content)) return null;

  const timelineItems = parseTimelineContent(content);

  return (
    <View style={styles.section}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={[styles.iconCircle, { backgroundColor: color }]} />

        <Text
          style={{
            ...wrapText,
            fontSize: 15,
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#e5e7eb",
          marginTop: 8,
          marginBottom: 10,
        }}
      />

      {timelineItems ? (
        <TimelineItems items={timelineItems} color={color} />
      ) : (
        <Text style={styles.bodyText}>{content}</Text>
      )}
    </View>
  );
}

function BlueSidebarPDFBlock({
  title,
  content,
  color,
  bordered = false,
}: {
  title: string;
  content: string;
  color: string;
  bordered?: boolean;
}) {
  if (!hasVisibleContent(content)) return null;

  return (
    <View style={{ marginBottom: 17 }}>
      <View
        style={{
          alignSelf: "flex-start",
          paddingVertical: 6,
          paddingHorizontal: 13,
          borderRadius: 999,
          borderWidth: bordered ? 1 : 0,
          borderColor: color,
          backgroundColor: bordered ? "transparent" : color,
        }}
      >
        <Text
          style={{
            fontSize: 8.8,
            fontWeight: "bold",
            letterSpacing: 1.7,
            textTransform: "uppercase",
            color: bordered ? color : "#ffffff",
          }}
        >
          {title}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 9,
          lineHeight: 1.65,
          color: "#f3f4f6",
        }}
      >
        {timelineToPlainText(content)}
      </Text>
    </View>
  );
}

function BlueSidebarPDFContact({
  data,
  color,
}: {
  data: ResumeData;
  color: string;
}) {
  const contactItems = getContactItems(data);
  const linkItems = getLinkItems(data);

  if (contactItems.length === 0 && linkItems.length === 0) return null;

  return (
    <View style={{ marginBottom: 17 }}>
      <View
        style={{
          alignSelf: "flex-start",
          paddingVertical: 6,
          paddingHorizontal: 13,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: color,
        }}
      >
        <Text
          style={{
            fontSize: 8.8,
            fontWeight: "bold",
            letterSpacing: 1.7,
            textTransform: "uppercase",
            color: color,
          }}
        >
          Contact
        </Text>
      </View>

      <View style={{ marginTop: 10 }}>
        {contactItems.map((item) => (
          <Text key={item} style={{ fontSize: 9, lineHeight: 1.6, color: "#f3f4f6" }}>
            {item}
          </Text>
        ))}

        {linkItems.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontSize: 8,
                fontWeight: "bold",
                letterSpacing: 1.3,
                textTransform: "uppercase",
                color: "#bfdbfe",
                marginBottom: 4,
              }}
            >
              Professional Links
            </Text>

            {linkItems.map((item) => (
              <Link
                key={item.label}
                src={item.url}
                style={{
                  fontSize: 9,
                  lineHeight: 1.55,
                  color: "#f3f4f6",
                  textDecoration: "none",
                }}
              >
                {item.label} - {item.displayUrl}
              </Link>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function BlueMainPDFBlock({
  title,
  content,
  color,
}: {
  title: string;
  content?: string;
  color: string;
}) {
  if (!hasVisibleContent(content)) return null;

  const timelineItems = parseTimelineContent(content);

  return (
    <View style={{ marginBottom: 17 }}>
      <View
        style={{
          alignSelf: "flex-start",
          paddingVertical: 7,
          paddingHorizontal: 18,
          borderRadius: 999,
          backgroundColor: color,
        }}
      >
        <Text
          style={{
            fontSize: 9.5,
            fontWeight: "bold",
            letterSpacing: 1.7,
            textTransform: "uppercase",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </View>

      <View style={{ marginTop: 10 }}>
        {timelineItems ? (
          <TimelineItems items={timelineItems} color={color} />
        ) : (
          <Text
            style={{
              fontSize: 9.8,
              lineHeight: 1.55,
              color: "#374151",
            }}
          >
            {content}
          </Text>
        )}
      </View>
    </View>
  );
}

function CustomSectionsPDF({
  data,
  color,
}: {
  data: ResumeData;
  color: string;
}) {
  const visibleSections = getAllVisibleSections(data);

  if (visibleSections.length === 0) return null;

  return (
    <>
      {visibleSections.map((section) => (
        <Section
          key={`${section.id}-${section.title}`}
          title={section.title}
          content={section.content}
          color={color}
        />
      ))}
    </>
  );
}

function CustomGoldSectionsPDF({
  data,
  color,
}: {
  data: ResumeData;
  color: string;
}) {
  const visibleSections = getAllVisibleSections(data);

  if (visibleSections.length === 0) return null;

  return (
    <>
      {visibleSections.map((section) => (
        <GoldSection
          key={`${section.id}-${section.title}`}
          title={section.title}
          content={section.content}
          color={color}
        />
      ))}
    </>
  );
}

function CustomYellowSectionsPDF({
  data,
  color,
}: {
  data: ResumeData;
  color: string;
}) {
  const visibleSections = getAllVisibleSections(data);

  if (visibleSections.length === 0) return null;

  return (
    <>
      {visibleSections.map((section) => (
        <YellowSection
          key={`${section.id}-${section.title}`}
          title={section.title}
          content={section.content}
          color={color}
        />
      ))}
    </>
  );
}

function CustomIconSectionsPDF({
  data,
  color,
}: {
  data: ResumeData;
  color: string;
}) {
  const visibleSections = getAllVisibleSections(data);

  if (visibleSections.length === 0) return null;

  return (
    <>
      {visibleSections.map((section) => (
        <IconSection
          key={`${section.id}-${section.title}`}
          title={section.title}
          content={section.content}
          color={color}
        />
      ))}
    </>
  );
}
