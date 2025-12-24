import { NextResponse } from 'next/server';
import { tournamentTemplates, templateCategories, getTemplateById } from '@/lib/tournament-templates';

// GET /api/templates - Fetch all templates or filter by category
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    // Return single template by ID
    if (id) {
      const template = getTemplateById(id);
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
      return NextResponse.json({ template });
    }

    // Return templates filtered by category
    if (category) {
      const filteredTemplates = tournamentTemplates.filter((t) => t.category === category);
      return NextResponse.json({ templates: filteredTemplates, count: filteredTemplates.length });
    }

    // Return all templates with categories
    return NextResponse.json({
      templates: tournamentTemplates,
      categories: templateCategories,
      count: tournamentTemplates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
