import { Injectable } from '@nestjs/common';
import type { BootcampChallengeSummary, BootcampState, LeaderboardEntry } from '@kia-academy/shared';
import { PrismaService } from '../prisma/prisma.service';

const STATIC_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Priya M.', score: 890 },
  { rank: 2, name: 'Diego F.', score: 845 },
  { rank: 3, name: 'Sam K.', score: 810 },
  { rank: 4, name: 'Yuki T.', score: 610 },
  { rank: 12, name: 'You', score: 340, isMe: true },
];

@Injectable()
export class BootcampService {
  constructor(private readonly prisma: PrismaService) {}

  getLeaderboard(): LeaderboardEntry[] {
    return STATIC_LEADERBOARD;
  }

  async getState(userId: string): Promise<BootcampState> {
    let rank = 12;
    let points = 340;

    const [profile, challenges] = await Promise.all([
      this.prisma.bootcampProfile.findUnique({ where: { userId } }),
      this.prisma.challenge.findMany({
        orderBy: { startsAt: 'desc' },
        take: 8,
      }),
    ]);

    if (profile) {
      rank = profile.rank;
      points = profile.points;
    }

    const now = Date.now();
    const mapped: BootcampChallengeSummary[] = challenges.map((challenge) => {
      const start = challenge.startsAt.getTime();
      const end = challenge.endsAt.getTime();
      let status: BootcampChallengeSummary['status'] = 'ended';
      if (challenge.active && now >= start && now <= end) status = 'active';
      else if (challenge.active && now < start) status = 'open';
      else if (challenge.active && now > end) status = 'ended';
      else if (!challenge.active && now < start) status = 'open';

      return {
        id: challenge.id,
        slug: challenge.slug,
        title: challenge.title,
        startsAt: challenge.startsAt.toISOString(),
        endsAt: challenge.endsAt.toISOString(),
        status,
        points: challenge.points,
      };
    });

    const active = mapped.find((c) => c.status === 'active');
    const cardTimerSeconds = active
      ? Math.max(0, Math.floor((new Date(active.endsAt).getTime() - now) / 1000))
      : 2 * 3600 + 14 * 60 + 8;

    return {
      rank,
      points,
      leaderboard: this.getLeaderboard(),
      cardTimerSeconds,
      challenges: mapped,
    };
  }
}
