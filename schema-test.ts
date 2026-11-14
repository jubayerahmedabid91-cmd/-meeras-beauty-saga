import { z } from 'zod';

const schema = z.object({
  kind: z.enum(['service', 'package']),
  serviceSlug: z.string().nullable(),
  packageSlug: z.string().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  staffId: z.string().nullable(),
  customer: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(7).max(30),
    notes: z.string().max(1000).optional(),
  }),
});

const tests = [
  { name: 'test1', body: { kind: 'service', serviceSlug: 'signature-cut', date: '2027-01-15', time: '10:00', staffId: null, customer: { name: 'Test', email: 'test@test.com', phone: '01700000000' } } },
  { name: 'test2', body: { kind: 'service', serviceSlug: 'signature-cut', date: '2027-01-15', time: '10:00', customer: { name: 'Test', email: 'test@test.com', phone: '01700000000' } } },
];

for (const t of tests) {
  const r = schema.safeParse(t.body);
  console.log(t.name, r.success, r.error?.issues?.map(i => i.path.join('.') + ': ' + i.message).join(', ') || 'OK');
}
