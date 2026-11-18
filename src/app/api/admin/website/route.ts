import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { roleHasPermission } from "@/lib/permissions";

// Create a new website content record
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    if (!roleHasPermission(session.user.role as "OWNER" | "ADMIN" | "MANAGER" | "RECEPTIONIST" | "STAFF" | "CUSTOMER", "content:manage")) return new NextResponse("Forbidden", { status: 403 });

    const body = await request.json();
    const { resource, ...data } = body;

    const validResources = ["teamProfile", "testimonial", "contactMessage", "fAQ", "galleryImage"];
    if (!validResources.includes(resource)) {
      return new NextResponse("Invalid resource", { status: 400 });
    }

    let created;
    switch (resource) {
      case "teamProfile":
        created = await prisma.teamProfile.create({ data });
        break;
      case "testimonial":
        created = await prisma.testimonial.create({ data });
        break;
      case "contactMessage":
        created = await prisma.contactMessage.create({ data });
        break;
      case "fAQ":
        created = await prisma.fAQ.create({ data });
        break;
      case "galleryImage":
        created = await prisma.galleryImage.create({ data });
        break;
    }

    if (!created) {
      return new NextResponse("Create failed", { status: 500 });
    }

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "CREATE", entity: `website:${resource}`, entityId: created.id, metadata: JSON.stringify(data) }
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Website create error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Update an existing website content record
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    if (!roleHasPermission(session.user.role as "OWNER" | "ADMIN" | "MANAGER" | "RECEPTIONIST" | "STAFF" | "CUSTOMER", "content:manage")) return new NextResponse("Forbidden", { status: 403 });

    const body = await request.json();
    const { id, resource, ...data } = body;

    const validResources = ["teamProfile", "testimonial", "contactMessage", "fAQ", "galleryImage"];
    if (!validResources.includes(resource)) {
      return new NextResponse("Invalid resource", { status: 400 });
    }

    let updated;
    switch (resource) {
      case "teamProfile":
        updated = await prisma.teamProfile.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
        break;
      case "testimonial":
        updated = await prisma.testimonial.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
        break;
      case "contactMessage":
        updated = await prisma.contactMessage.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
        break;
      case "fAQ":
        updated = await prisma.fAQ.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
        break;
      case "galleryImage":
        updated = await prisma.galleryImage.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
        break;
    }

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "UPDATE", entity: `website:${resource}`, entityId: id, metadata: JSON.stringify(data) }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Website update error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete a website content record
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    if (!roleHasPermission(session.user.role as "OWNER" | "ADMIN" | "MANAGER" | "RECEPTIONIST" | "STAFF" | "CUSTOMER", "content:manage")) return new NextResponse("Forbidden", { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const resource = searchParams.get("resource");

    if (!id || !resource) return new NextResponse("Missing id or resource", { status: 400 });

    // Only website-content models may be deleted through this endpoint.
    // Never build a Prisma delegate from a raw query parameter — an authorised
    // caller could otherwise delete users, bookings or payments by name.
    const validResources = ["teamProfile", "testimonial", "contactMessage", "fAQ", "galleryImage"];
    if (!validResources.includes(resource)) {
      return new NextResponse("Invalid resource", { status: 400 });
    }

    switch (resource) {
      case "teamProfile":
        await prisma.teamProfile.delete({ where: { id } });
        break;
      case "testimonial":
        await prisma.testimonial.delete({ where: { id } });
        break;
      case "contactMessage":
        await prisma.contactMessage.delete({ where: { id } });
        break;
      case "fAQ":
        await prisma.fAQ.delete({ where: { id } });
        break;
      case "galleryImage":
        await prisma.galleryImage.delete({ where: { id } });
        break;
    }

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "DELETE", entity: `website:${resource}`, entityId: id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Website delete error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
