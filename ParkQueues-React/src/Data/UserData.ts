export class UserData {
  uid: string
  maxFavs: {
    num: number
    expirationStack: [{
      expiration: number
      newMaxFav: number
    }]
  }

  favs: UserDataAttr[]
  maxNotifs: {
    num: number
    expires: number | null
  }

  notifs: UserDataAttr[]

  constructor (uid: string, maxFavs: { num: number, expirationStack: [{ expiration: number, newMaxFav: number }] },
    favs: UserDataAttr[], maxNotifs: { num: number, expires: number | null }, notifs: UserDataAttr[]) {
    this.uid = uid
    this.maxFavs = maxFavs
    this.favs = favs
    this.maxNotifs = maxNotifs
    this.notifs = notifs
  }

  public static fromJson (json: string | null | undefined): UserData | null {
    if (json != null) {
      const jsonObject: {
        uid: string
        maxFavs: { num: number, expirationStack: [{ expiration: number, newMaxFav: number }] }
        favs: any[]
        maxNotifs: { num: number, expires: number | null }
        notifs: any[]
      } = JSON.parse(json)

      const favs: UserDataAttr[] = jsonObject.favs.map(fav => new UserDataAttr(fav.destId, fav.parkId, fav.id, fav.added, fav.expires))
      const notifs: UserDataAttr[] = jsonObject.notifs.map(notif => new UserDataAttr(notif.destId, notif.parkId, notif.id, notif.added, notif.expires))

      return new UserData(
        jsonObject.uid,
        jsonObject.maxFavs,
        favs,
        jsonObject.maxNotifs,
        notifs
      )
    } else {
      return null
    }
  }

  public toJson (): string {
    return JSON.stringify(this)
  }
}

export class UserDataAttr {
  destId: string
  parkId: string
  id: string
  added: number
  expires: number | null

  constructor (destId: string, parkId: string, id: string, added: number, expires: number | null) {
    this.destId = destId
    this.parkId = parkId
    this.id = id
    this.added = added
    this.expires = expires
  }
}
